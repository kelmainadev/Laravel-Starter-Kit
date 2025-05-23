<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $projects = Project::with(['owner:id,name,email', 'tasks', 'members:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhereHas('members', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        // Transform data for frontend
        $projects->getCollection()->transform(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'status_badge' => $project->status_badge,
                'priority' => $project->priority,
                'priority_badge' => $project->priority_badge,
                'due_date' => $project->due_date?->format('Y-m-d'),
                'progress' => $project->progress,
                'budget' => $project->budget,
                'owner' => $project->owner,
                'tasks_count' => $project->tasks->count(),
                'completed_tasks_count' => $project->tasks->where('status', 'completed')->count(),
                'members_count' => $project->members->count(),
                'is_owner' => $project->owner_id === Auth::id(),
                'created_at' => $project->created_at->format('M d, Y'),
                'tags' => $project->tags ?? [],
            ];
        });

        return Inertia::render('User/Projects/Index', [
            'projects' => $projects->items(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
                'has_more_pages' => $projects->hasMorePages(),
            ],
            'filters' => $request->only(['search', 'status', 'priority']),
            'stats' => [
                'total' => $user->allProjects()->count(),
                'active' => $user->allProjects()->where('status', Project::STATUS_ACTIVE)->count(),
                'completed' => $user->allProjects()->where('status', Project::STATUS_COMPLETED)->count(),
                'overdue' => $user->allProjects()->where('due_date', '<', now())
                    ->whereNotIn('status', [Project::STATUS_COMPLETED, Project::STATUS_CANCELLED])
                    ->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        return Inertia::render('User/Projects/Create');
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
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
            'owner_id' => Auth::id(),
            'status' => $request->status,
            'priority' => $request->priority,
            'start_date' => $request->start_date,
            'due_date' => $request->due_date,
            'budget' => $request->budget,
            'tags' => $request->tags,
            'notes' => $request->notes,
        ]);

        return redirect()->route('user.projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        // Check access
        if (!$project->canUserAccess(Auth::id())) {
            abort(403, 'You do not have access to this project.');
        }

        $project->load([
            'owner:id,name,email',
            'members:id,name,email',
            'tasks.assignedUser:id,name,email',
            'tasks.creator:id,name,email'
        ]);

        // Get project tasks with filtering
        $tasks = $project->tasks()
            ->with(['assignedUser:id,name', 'creator:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($task) {
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
                    'assigned_user' => $task->assignedUser,
                    'creator' => $task->creator,
                    'is_overdue' => $task->is_overdue,
                    'is_due_soon' => $task->is_due_soon,
                    'created_at' => $task->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('User/Projects/Show', [
            'project' => [
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
                'notes' => $project->notes,
                'tags' => $project->tags ?? [],
                'owner' => $project->owner,
                'members' => $project->members,
                'is_owner' => $project->owner_id === Auth::id(),
                'created_at' => $project->created_at->format('M d, Y'),
            ],
            'tasks' => $tasks,
            'taskStats' => [
                'total' => $tasks->count(),
                'todo' => $tasks->where('status', 'todo')->count(),
                'in_progress' => $tasks->where('status', 'in_progress')->count(),
                'completed' => $tasks->where('status', 'completed')->count(),
                'overdue' => $tasks->where('is_overdue', true)->count(),
            ],
            'members' => $project->members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'role' => $member->pivot->role,
                    'joined_at' => $member->pivot->joined_at->format('M d, Y'),
                ];
            }),
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project)
    {
        // Check access
        if (!$project->isOwner(Auth::id())) {
            abort(403, 'You can only edit projects you own.');
        }

        return Inertia::render('User/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'priority' => $project->priority,
                'start_date' => $project->start_date?->format('Y-m-d'),
                'due_date' => $project->due_date?->format('Y-m-d'),
                'budget' => $project->budget,
                'notes' => $project->notes,
                'tags' => $project->tags ?? [],
            ],
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        // Check access
        if (!$project->isOwner(Auth::id())) {
            abort(403, 'You can only edit projects you own.');
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

        return redirect()->route('user.projects.show', $project)
            ->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        // Check access
        if (!$project->isOwner(Auth::id())) {
            abort(403, 'You can only delete projects you own.');
        }

        $project->delete();

        return redirect()->route('user.projects.index')
            ->with('success', 'Project deleted successfully!');
    }

    /**
     * Add a member to the project.
     */
    public function addMember(Request $request, Project $project)
    {
        // Check access
        if (!$project->isOwner(Auth::id())) {
            abort(403, 'Only project owners can add members.');
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:member,manager,viewer',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($project->isMember($user->id) || $project->isOwner($user->id)) {
            return back()->withErrors(['email' => 'User is already a member of this project.']);
        }

        $project->members()->attach($user->id, [
            'role' => $request->role,
            'joined_at' => now(),
        ]);

        // Send notification to the invited user
        $user->notify(new ProjectInvitation($project, Auth::user(), $request->role));

        return back()->with('success', 'Member added successfully!');
    }

    /**
     * Remove a member from the project.
     */
    public function removeMember(Project $project, User $user)
    {
        // Check access
        if (!$project->isOwner(Auth::id())) {
            abort(403, 'Only project owners can remove members.');
        }

        if ($project->isOwner($user->id)) {
            return back()->withErrors(['error' => 'Cannot remove project owner.']);
        }

        $project->members()->detach($user->id);

        return back()->with('success', 'Member removed successfully!');
    }
}
