<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Task::with(['project:id,name', 'assignedUser:id,name', 'creator:id,name'])
            ->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                    ->orWhere('assigned_to', $user->id)
                    ->orWhereHas('project', function ($q2) use ($user) {
                        $q2->where('owner_id', $user->id)
                            ->orWhereHas('members', function ($q3) use ($user) {
                                $q3->where('user_id', $user->id);
                            });
                    });
            });

        // Apply filters
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('assigned_to')) {
            if ($request->assigned_to === 'me') {
                $query->where('assigned_to', $user->id);
            } elseif ($request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        // Date filters
        if ($request->has('due_date_from')) {
            $query->where('due_date', '>=', $request->due_date_from);
        }

        if ($request->has('due_date_to')) {
            $query->where('due_date', '<=', $request->due_date_to);
        }

        if ($request->has('overdue') && $request->boolean('overdue')) {
            $query->overdue();
        }

        if ($request->has('due_soon') && $request->boolean('due_soon')) {
            $query->dueSoon();
        }

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);
        $tasks = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform data
        $tasks->getCollection()->transform(function ($task) {
            return $this->transformTask($task);
        });

        return response()->json([
            'tasks' => $tasks->items(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
            ]
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => ['required', Rule::in(['todo', 'in_progress', 'in_review', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'due_date' => 'nullable|date|after_or_equal:today',
            'estimated_hours' => 'nullable|integer|min:1',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        // Check project access if project_id is provided
        if ($request->project_id) {
            $project = Project::find($request->project_id);
            if (!$project || !$project->canUserAccess($request->user()->id)) {
                return response()->json([
                    'message' => 'You do not have access to this project.'
                ], 403);
            }

            // Check if assigned user has access to the project
            if ($request->assigned_to && !$project->canUserAccess($request->assigned_to)) {
                return response()->json([
                    'message' => 'The assigned user does not have access to this project.'
                ], 422);
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
            'created_by' => $request->user()->id,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'estimated_hours' => $request->estimated_hours,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ]);

        // Send notification if task is assigned to someone other than the creator
        if ($request->assigned_to && $request->assigned_to != $request->user()->id) {
            $assignedUser = User::find($request->assigned_to);
            if ($assignedUser) {
                $assignedUser->notify(new TaskAssigned($task, $request->user()));
            }
        }

        $task->load(['project:id,name', 'assignedUser:id,name', 'creator:id,name']);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $this->transformTask($task)
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        // Check access
        if (!$task->canUserAccess($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have access to this task.'
            ], 403);
        }

        $task->load([
            'project:id,name',
            'assignedUser:id,name,email',
            'creator:id,name,email'
        ]);

        return response()->json([
            'task' => $this->transformTask($task, true)
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        // Check access
        if (!$task->canUserEdit($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have permission to edit this task.'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => ['required', Rule::in(['todo', 'in_progress', 'in_review', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1',
            'actual_hours' => 'nullable|integer|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        // Check project access if project_id is provided
        if ($request->project_id) {
            $project = Project::find($request->project_id);
            if (!$project || !$project->canUserAccess($request->user()->id)) {
                return response()->json([
                    'message' => 'You do not have access to this project.'
                ], 403);
            }
        }

        $updateData = [
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'estimated_hours' => $request->estimated_hours,
            'actual_hours' => $request->actual_hours,
            'progress' => $request->progress,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ];

        // Track changes for notifications
        $originalAssignedTo = $task->assigned_to;
        $changes = [];
        
        foreach ($updateData as $field => $value) {
            if ($task->$field != $value) {
                $changes[$field] = [
                    'old' => $task->$field,
                    'new' => $value
                ];
            }
        }

        // Set completed_at when status changes to completed
        if ($request->status === Task::STATUS_COMPLETED && $task->status !== Task::STATUS_COMPLETED) {
            $updateData['completed_at'] = now();
            $updateData['progress'] = 100;
        } elseif ($request->status !== Task::STATUS_COMPLETED) {
            $updateData['completed_at'] = null;
        }

        $task->update($updateData);

        // Send notifications
        $this->sendTaskUpdateNotifications($task, $originalAssignedTo, $changes, $request->user());

        // Update project progress if task has a project
        if ($task->project) {
            $task->project->updateProgress();
        }

        $task->load(['project:id,name', 'assignedUser:id,name', 'creator:id,name']);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $this->transformTask($task)
        ]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        // Check access
        if (!$task->canUserEdit($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have permission to delete this task.'
            ], 403);
        }

        $project = $task->project;
        $task->delete();

        // Update project progress if task had a project
        if ($project) {
            $project->updateProgress();
        }

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * Mark task as completed.
     */
    public function markCompleted(Request $request, Task $task): JsonResponse
    {
        // Check access
        if (!$task->canUserEdit($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have permission to modify this task.'
            ], 403);
        }

        $task->markAsCompleted();

        return response()->json([
            'message' => 'Task marked as completed',
            'task' => $this->transformTask($task->fresh(['project:id,name', 'assignedUser:id,name', 'creator:id,name']))
        ]);
    }

    /**
     * Update task progress.
     */
    public function updateProgress(Request $request, Task $task): JsonResponse
    {
        // Check access
        if (!$task->canUserEdit($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have permission to modify this task.'
            ], 403);
        }

        $request->validate([
            'progress' => 'required|integer|min:0|max:100',
        ]);

        $updateData = ['progress' => $request->progress];

        // Auto-complete if progress is 100%
        if ($request->progress == 100 && $task->status !== Task::STATUS_COMPLETED) {
            $updateData['status'] = Task::STATUS_COMPLETED;
            $updateData['completed_at'] = now();
        }

        $task->update($updateData);

        // Update project progress if task has a project
        if ($task->project) {
            $task->project->updateProgress();
        }

        return response()->json([
            'message' => 'Task progress updated',
            'task' => $this->transformTask($task->fresh(['project:id,name', 'assignedUser:id,name', 'creator:id,name']))
        ]);
    }

    /**
     * Get task statistics for the authenticated user.
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $stats = [
            'total' => $user->allTasks()->count(),
            'assigned_to_me' => $user->assignedTasks()->pending()->count(),
            'created_by_me' => $user->createdTasks()->count(),
            'completed' => $user->allTasks()->completed()->count(),
            'overdue' => $user->allTasks()->overdue()->count(),
            'due_soon' => $user->allTasks()->dueSoon()->count(),
            'by_status' => [
                'todo' => $user->allTasks()->where('status', 'todo')->count(),
                'in_progress' => $user->allTasks()->where('status', 'in_progress')->count(),
                'in_review' => $user->allTasks()->where('status', 'in_review')->count(),
                'completed' => $user->allTasks()->where('status', 'completed')->count(),
                'cancelled' => $user->allTasks()->where('status', 'cancelled')->count(),
            ],
            'by_priority' => [
                'low' => $user->allTasks()->where('priority', 'low')->count(),
                'medium' => $user->allTasks()->where('priority', 'medium')->count(),
                'high' => $user->allTasks()->where('priority', 'high')->count(),
                'urgent' => $user->allTasks()->where('priority', 'urgent')->count(),
            ]
        ];

        return response()->json([
            'statistics' => $stats
        ]);
    }

    /**
     * Transform task data for API response.
     */
    private function transformTask(Task $task, bool $detailed = false): array
    {
        $data = [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'status_badge' => $task->status_badge,
            'priority' => $task->priority,
            'priority_badge' => $task->priority_badge,
            'due_date' => $task->due_date?->format('Y-m-d'),
            'progress' => $task->progress,
            'estimated_hours' => $task->estimated_hours,
            'actual_hours' => $task->actual_hours,
            'tags' => $task->tags ?? [],
            'project' => $task->project,
            'assigned_user' => $task->assignedUser,
            'creator' => $task->creator,
            'is_overdue' => $task->is_overdue,
            'is_due_soon' => $task->is_due_soon,
            'can_edit' => $task->canUserEdit(request()->user()->id),
            'created_at' => $task->created_at->toISOString(),
            'updated_at' => $task->updated_at->toISOString(),
        ];

        if ($detailed) {
            $data['notes'] = $task->notes;
            $data['completed_at'] = $task->completed_at?->toISOString();
        }

        return $data;
    }

    /**
     * Send task update notifications to relevant users.
     */
    private function sendTaskUpdateNotifications(Task $task, $originalAssignedTo, array $changes, User $currentUser)
    {
        $usersToNotify = collect();

        // If task assignment changed, send TaskAssigned notification to new assignee
        if (isset($changes['assigned_to']) && $task->assigned_to && $task->assigned_to != $currentUser->id) {
            $newAssignee = User::find($task->assigned_to);
            if ($newAssignee) {
                $newAssignee->notify(new TaskAssigned($task, $currentUser));
            }
        }

        // For other changes, send TaskUpdated notification to relevant users
        if (!empty($changes)) {
            // Notify original assignee if different from current user
            if ($originalAssignedTo && $originalAssignedTo != $currentUser->id) {
                $usersToNotify->push($originalAssignedTo);
            }

            // Notify new assignee if different from current user (and not handled above)
            if ($task->assigned_to && $task->assigned_to != $currentUser->id && !isset($changes['assigned_to'])) {
                $usersToNotify->push($task->assigned_to);
            }

            // Notify task creator if different from current user
            if ($task->created_by && $task->created_by != $currentUser->id) {
                $usersToNotify->push($task->created_by);
            }

            // Notify project owner if different from current user
            if ($task->project && $task->project->owner_id != $currentUser->id) {
                $usersToNotify->push($task->project->owner_id);
            }

            // Remove duplicates and send notifications
            $usersToNotify = $usersToNotify->unique();
            
            foreach ($usersToNotify as $userId) {
                $user = User::find($userId);
                if ($user) {
                    $user->notify(new TaskUpdated($task, $currentUser, $changes));
                }
            }
        }
    }
}
