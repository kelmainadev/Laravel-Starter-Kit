<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectInvitation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Project::with(['owner:id,name,email', 'tasks', 'members:id,name'])
            ->where(function ($q) use ($user) {
                $q->where('owner_id', $user->id)
                    ->orWhereHas('members', function ($q2) use ($user) {
                        $q2->where('user_id', $user->id);
                    });
            });

        // Apply filters
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);
        $projects = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform data
        $projects->getCollection()->transform(function ($project) {
            return $this->transformProject($project);
        });

        return response()->json([
            'projects' => $projects->items(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ]
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['planning', 'active', 'on_hold', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'owner_id' => $request->user()->id,
            'status' => $request->status,
            'priority' => $request->priority,
            'start_date' => $request->start_date,
            'due_date' => $request->due_date,
            'budget' => $request->budget,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ]);

        $project->load(['owner:id,name,email', 'tasks', 'members:id,name']);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $this->transformProject($project)
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Request $request, Project $project): JsonResponse
    {
        // Check access
        if (!$project->canUserAccess($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have access to this project.'
            ], 403);
        }

        $project->load([
            'owner:id,name,email',
            'members:id,name,email',
            'tasks.assignedUser:id,name,email',
            'tasks.creator:id,name,email'
        ]);

        return response()->json([
            'project' => $this->transformProject($project, true)
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        // Check access
        if (!$project->isOwner($request->user()->id)) {
            return response()->json([
                'message' => 'You can only edit projects you own.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['planning', 'active', 'on_hold', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $project->update([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'start_date' => $request->start_date,
            'due_date' => $request->due_date,
            'budget' => $request->budget,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ]);

        $project->load(['owner:id,name,email', 'tasks', 'members:id,name']);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $this->transformProject($project)
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        // Check access
        if (!$project->isOwner($request->user()->id)) {
            return response()->json([
                'message' => 'You can only delete projects you own.'
            ], 403);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * Add a member to the project.
     */
    public function addMember(Request $request, Project $project): JsonResponse
    {
        // Check access
        if (!$project->isOwner($request->user()->id)) {
            return response()->json([
                'message' => 'Only project owners can add members.'
            ], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:member,manager,viewer',
        ]);

        $user = User::find($request->user_id);

        if ($project->isMember($user->id) || $project->isOwner($user->id)) {
            return response()->json([
                'message' => 'User is already a member of this project.'
            ], 422);
        }

        $project->members()->attach($user->id, [
            'role' => $request->role,
            'joined_at' => now(),
        ]);

        // Send notification
        $user->notify(new ProjectInvitation($project, $request->user(), $request->role));

        return response()->json([
            'message' => 'Member added successfully'
        ]);
    }

    /**
     * Remove a member from the project.
     */
    public function removeMember(Request $request, Project $project, User $user): JsonResponse
    {
        // Check access
        if (!$project->isOwner($request->user()->id)) {
            return response()->json([
                'message' => 'Only project owners can remove members.'
            ], 403);
        }

        if ($project->isOwner($user->id)) {
            return response()->json([
                'message' => 'Cannot remove project owner.'
            ], 422);
        }

        $project->members()->detach($user->id);

        return response()->json([
            'message' => 'Member removed successfully'
        ]);
    }

    /**
     * Get project statistics.
     */
    public function statistics(Request $request, Project $project): JsonResponse
    {
        // Check access
        if (!$project->canUserAccess($request->user()->id)) {
            return response()->json([
                'message' => 'You do not have access to this project.'
            ], 403);
        }

        $project->load('tasks');

        $stats = [
            'total_tasks' => $project->tasks->count(),
            'completed_tasks' => $project->tasks->where('status', 'completed')->count(),
            'in_progress_tasks' => $project->tasks->where('status', 'in_progress')->count(),
            'overdue_tasks' => $project->tasks->filter(function ($task) {
                return $task->is_overdue;
            })->count(),
            'members_count' => $project->members->count() + 1, // +1 for owner
            'progress_percentage' => $project->progress,
            'budget_spent' => $project->tasks->sum('actual_hours') * 50, // Assuming $50/hour
            'budget_remaining' => max(0, ($project->budget ?? 0) - ($project->tasks->sum('actual_hours') * 50)),
        ];

        return response()->json([
            'statistics' => $stats
        ]);
    }

    /**
     * Transform project data for API response.
     */
    private function transformProject(Project $project, bool $detailed = false): array
    {
        $data = [
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'status' => $project->status,
            'status_badge' => $project->status_badge,
            'priority' => $project->priority,
            'priority_badge' => $project->priority_badge,
            'start_date' => $project->start_date?->format('Y-m-d'),
            'due_date' => $project->due_date?->format('Y-m-d'),
            'budget' => $project->budget,
            'progress' => $project->progress,
            'tags' => $project->tags ?? [],
            'owner' => $project->owner,
            'tasks_count' => $project->tasks->count(),
            'completed_tasks_count' => $project->tasks->where('status', 'completed')->count(),
            'members_count' => $project->members->count(),
            'is_owner' => $project->owner_id === request()->user()->id,
            'created_at' => $project->created_at->toISOString(),
            'updated_at' => $project->updated_at->toISOString(),
        ];

        if ($detailed) {
            $data['notes'] = $project->notes;
            $data['members'] = $project->members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'role' => $member->pivot->role,
                    'joined_at' => $member->pivot->joined_at->format('Y-m-d'),
                ];
            });
            $data['tasks'] = $project->tasks->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'progress' => $task->progress,
                    'assigned_user' => $task->assignedUser,
                    'creator' => $task->creator,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'is_overdue' => $task->is_overdue,
                ];
            });
        }

        return $data;
    }
}
