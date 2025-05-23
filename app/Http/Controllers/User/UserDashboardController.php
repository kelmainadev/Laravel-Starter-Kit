<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get task statistics
        $taskStats = [
            'total' => $user->allTasks()->count(),
            'assigned_to_me' => $user->assignedTasks()->pending()->count(),
            'created_by_me' => $user->createdTasks()->count(),
            'completed' => $user->allTasks()->completed()->count(),
            'overdue' => $user->allTasks()->overdue()->count(),
            'due_soon' => $user->allTasks()->dueSoon()->count(),
            'in_progress' => $user->allTasks()->where('status', Task::STATUS_IN_PROGRESS)->count(),
        ];

        // Get project statistics
        $projectStats = [
            'total' => $user->allProjects()->count(),
            'owned' => $user->ownedProjects()->count(),
            'member_of' => $user->projects()->count(),
            'active' => $user->allProjects()->where('status', Project::STATUS_ACTIVE)->count(),
            'completed' => $user->allProjects()->where('status', Project::STATUS_COMPLETED)->count(),
            'overdue' => $user->allProjects()->where('due_date', '<', now())
                ->whereNotIn('status', [Project::STATUS_COMPLETED, Project::STATUS_CANCELLED])
                ->count(),
        ];

        // Get post statistics
        $postStats = [
            'total' => $user->posts()->count(),
            'published' => $user->posts()->where('status', Post::STATUS_PUBLISHED)->count(),
            'draft' => $user->posts()->where('status', Post::STATUS_DRAFT)->count(),
            'flagged' => $user->posts()->where('status', Post::STATUS_FLAGGED)->count(),
            'rejected' => $user->posts()->where('status', Post::STATUS_REJECTED)->count(),
        ];

        // Calculate profile completion percentage
        $profileCompletion = $this->calculateProfileCompletion($user);

        // Get recent tasks (last 5)
        $recentTasks = $user->allTasks()
            ->with(['project:id,name', 'assignedUser:id,name'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_date' => $task->due_date,
                    'project' => $task->project?->name,
                    'assigned_to' => $task->assignedUser?->name,
                    'progress' => $task->progress,
                    'is_overdue' => $task->is_overdue,
                    'is_due_soon' => $task->is_due_soon,
                ];
            });

        // Get recent projects (last 5)
        $recentProjects = $user->allProjects()
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'status' => $project->status,
                    'priority' => $project->priority,
                    'due_date' => $project->due_date,
                    'progress' => $project->progress,
                    'members_count' => $project->members()->count() + 1, // +1 for owner
                ];
            });

        // Get upcoming deadlines
        $upcomingDeadlines = collect([
            ...$user->allTasks()->dueSoon()->with(['project:id,name'])->get()->map(function ($task) {
                return [
                    'type' => 'task',
                    'id' => $task->id,
                    'title' => $task->title,
                    'due_date' => $task->due_date,
                    'project' => $task->project?->name,
                    'priority' => $task->priority,
                    'days_until_due' => now()->diffInDays($task->due_date, false),
                ];
            }),
            ...$user->allProjects()->where('due_date', '>=', now())->where('due_date', '<=', now()->addDays(7))->get()->map(function ($project) {
                return [
                    'type' => 'project',
                    'id' => $project->id,
                    'title' => $project->name,
                    'due_date' => $project->due_date,
                    'project' => null,
                    'priority' => $project->priority,
                    'days_until_due' => now()->diffInDays($project->due_date, false),
                ];
            }),
        ])->sortBy('due_date')->take(5);

        return Inertia::render('User/Dashboard', [
            'message' => "Welcome back, {$user->name}! Here's your task overview.",
            'stats' => [
                'tasks' => $taskStats,
                'projects' => $projectStats,
                'posts' => $postStats,
                'posts_created' => $postStats['total'], // For backward compatibility
                'profile_completion' => $profileCompletion,
            ],
            'recentTasks' => $recentTasks,
            'recentProjects' => $recentProjects,
            'upcomingDeadlines' => $upcomingDeadlines->values(),
        ]);
    }

    /**
     * Calculate profile completion percentage
     */
    private function calculateProfileCompletion($user)
    {
        $fields = [
            'name' => !empty($user->name),
            'email' => !empty($user->email),
            'email_verified' => !is_null($user->email_verified_at),
            'avatar' => !empty($user->avatar), // Assuming avatar field exists
            'bio' => !empty($user->bio), // Assuming bio field exists
            'phone' => !empty($user->phone), // Assuming phone field exists
        ];

        $completedFields = array_filter($fields);
        $totalFields = count($fields);
        $completedCount = count($completedFields);

        return round(($completedCount / $totalFields) * 100);
    }
} 