<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $tasks = Task::with(['project:id,name', 'assignedUser:id,name', 'creator:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhere('assigned_to', $user->id)
                    ->orWhereHas('project', function ($q) use ($user) {
                        $q->where('owner_id', $user->id)
                            ->orWhereHas('members', function ($q2) use ($user) {
                                $q2->where('user_id', $user->id);
                            });
                    });
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->when($request->input('project_id'), function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->when($request->input('assigned_to'), function ($query, $assignedTo) {
                if ($assignedTo === 'me') {
                    $query->where('assigned_to', Auth::id());
                } elseif ($assignedTo === 'unassigned') {
                    $query->whereNull('assigned_to');
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Transform data for frontend
        $tasks->getCollection()->transform(function ($task) {
            return [
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
                'project' => $task->project,
                'assigned_user' => $task->assignedUser,
                'creator' => $task->creator,
                'is_overdue' => $task->is_overdue,
                'is_due_soon' => $task->is_due_soon,
                'can_edit' => $task->canUserEdit(Auth::id()),
                'created_at' => $task->created_at->format('M d, Y'),
                'tags' => $task->tags ?? [],
            ];
        });

        // Get user's accessible projects for filtering
        $userProjects = $user->allProjects()->select('id', 'name')->get();

        return Inertia::render('User/Tasks/Index', [
            'tasks' => $tasks->items(),
            'projects' => $userProjects->toArray(),
            'pagination' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'has_more_pages' => $tasks->hasMorePages(),
            ],
            'filters' => $request->only(['search', 'status', 'priority', 'project_id', 'assigned_to']),
            'stats' => [
                'total' => $user->allTasks()->count(),
                'assigned_to_me' => $user->assignedTasks()->pending()->count(),
                'created_by_me' => $user->createdTasks()->count(),
                'completed' => $user->allTasks()->completed()->count(),
                'overdue' => $user->allTasks()->overdue()->count(),
                'due_soon' => $user->allTasks()->dueSoon()->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(Request $request)
    {
        $user = Auth::user();
        $projectId = $request->input('project_id');
        
        // Get user's accessible projects
        $projects = $user->allProjects()->select('id', 'name')->get();
        
        // Get project members if a project is selected
        $projectMembers = [];
        if ($projectId) {
            $project = Project::find($projectId);
            if ($project && $project->canUserAccess($user->id)) {
                $projectMembers = $project->members()->select('id', 'name', 'email')->get()
                    ->merge([$project->owner()->select('id', 'name', 'email')->first()]);
            }
        }

        return Inertia::render('User/Tasks/Create', [
            'projects' => $projects->toArray(),
            'project_members' => $projectMembers,
            'selected_project_id' => $projectId,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request)
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
            if (!$project || !$project->canUserAccess(Auth::id())) {
                abort(403, 'You do not have access to this project.');
            }
        }

        // Check if assigned user has access to the project
        if ($request->assigned_to && $request->project_id) {
            $project = Project::find($request->project_id);
            if (!$project->canUserAccess($request->assigned_to)) {
                return back()->withErrors(['assigned_to' => 'The assigned user does not have access to this project.']);
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
            'created_by' => Auth::id(),
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'estimated_hours' => $request->estimated_hours,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ]);

        // Send notification if task is assigned to someone other than the creator
        if ($request->assigned_to && $request->assigned_to != Auth::id()) {
            $assignedUser = User::find($request->assigned_to);
            if ($assignedUser) {
                $assignedUser->notify(new TaskAssigned($task, Auth::user()));
            }
        }

        return redirect()->route('user.tasks.show', $task)
            ->with('success', 'Task created successfully!');
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        // Check access
        if (!$task->canUserAccess(Auth::id())) {
            abort(403, 'You do not have access to this task.');
        }

        $task->load([
            'project:id,name',
            'assignedUser:id,name,email',
            'creator:id,name,email'
        ]);

        return Inertia::render('User/Tasks/Show', [
            'task' => [
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
                'notes' => $task->notes,
                'tags' => $task->tags ?? [],
                'project' => $task->project,
                'assigned_user' => $task->assignedUser,
                'creator' => $task->creator,
                'is_overdue' => $task->is_overdue,
                'is_due_soon' => $task->is_due_soon,
                'can_edit' => $task->canUserEdit(Auth::id()),
                'completed_at' => $task->completed_at?->format('M d, Y H:i'),
                'created_at' => $task->created_at->format('M d, Y H:i'),
                'updated_at' => $task->updated_at->format('M d, Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Task $task)
    {
        // Check access
        if (!$task->canUserEdit(Auth::id())) {
            abort(403, 'You do not have permission to edit this task.');
        }

        $user = Auth::user();
        $projects = $user->allProjects()->select('id', 'name')->get();
        
        // Get project members if task has a project
        $projectMembers = [];
        if ($task->project_id) {
            $project = $task->project;
            $projectMembers = $project->members()->select('id', 'name', 'email')->get()
                ->merge([$project->owner()->select('id', 'name', 'email')->first()]);
        }

        return Inertia::render('User/Tasks/Edit', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'project_id' => $task->project_id,
                'assigned_to' => $task->assigned_to,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->format('Y-m-d'),
                'estimated_hours' => $task->estimated_hours,
                'actual_hours' => $task->actual_hours,
                'progress' => $task->progress,
                'notes' => $task->notes,
                'tags' => $task->tags ?? [],
            ],
            'projects' => $projects,
            'project_members' => $projectMembers,
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task)
    {
        // Check access
        if (!$task->canUserEdit(Auth::id())) {
            abort(403, 'You do not have permission to edit this task.');
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
            if (!$project || !$project->canUserAccess(Auth::id())) {
                abort(403, 'You do not have access to this project.');
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
        $this->sendTaskUpdateNotifications($task, $originalAssignedTo, $changes);

        // Update project progress if task has a project
        if ($task->project) {
            $task->project->updateProgress();
        }

        return redirect()->route('user.tasks.show', $task)
            ->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task)
    {
        // Check access
        if (!$task->canUserEdit(Auth::id())) {
            abort(403, 'You do not have permission to delete this task.');
        }

        $project = $task->project;
        $task->delete();

        // Update project progress if task had a project
        if ($project) {
            $project->updateProgress();
        }

        return redirect()->route('user.tasks.index')
            ->with('success', 'Task deleted successfully!');
    }

    /**
     * Mark task as completed.
     */
    public function markCompleted(Task $task)
    {
        // Check access
        if (!$task->canUserEdit(Auth::id())) {
            abort(403, 'You do not have permission to modify this task.');
        }

        $task->markAsCompleted();

        return back()->with('success', 'Task marked as completed!');
    }

    /**
     * Update task progress.
     */
    public function updateProgress(Request $request, Task $task)
    {
        // Check access
        if (!$task->canUserEdit(Auth::id())) {
            abort(403, 'You do not have permission to modify this task.');
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

        return back()->with('success', 'Task progress updated!');
    }

    /**
     * Send task update notifications to relevant users.
     */
    private function sendTaskUpdateNotifications(Task $task, $originalAssignedTo, array $changes)
    {
        $currentUser = Auth::user();
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
