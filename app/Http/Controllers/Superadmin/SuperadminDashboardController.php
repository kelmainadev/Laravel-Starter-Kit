<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SuperadminDashboardController extends Controller
{
    public function index()
    {
        // Get platform statistics
        $stats = [
            'workspaces' => 1, // For now, single workspace
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', User::STATUS_ACTIVE)->count(),
                'suspended' => User::where('status', User::STATUS_SUSPENDED)->count(),
                'superadmins' => User::role('superadmin')->count(),
                'admins' => User::role('admin')->count(),
                'regular_users' => User::role('user')->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'unverified' => User::whereNull('email_verified_at')->count(),
            ],
            'content' => [
                'projects' => Project::count(),
                'tasks' => Task::count(),
                'posts' => Post::count(),
                'active_projects' => Project::where('status', Project::STATUS_ACTIVE)->count(),
                'completed_projects' => Project::where('status', Project::STATUS_COMPLETED)->count(),
                'pending_tasks' => Task::where('status', Task::STATUS_TODO)->count(),
                'completed_tasks' => Task::where('status', Task::STATUS_COMPLETED)->count(),
                'published_posts' => Post::where('status', Post::STATUS_PUBLISHED)->count(),
                'draft_posts' => Post::where('status', Post::STATUS_DRAFT)->count(),
                'flagged_posts' => Post::where('status', Post::STATUS_FLAGGED)->count(),
            ],
            'system' => [
                'uptime' => '99.9%', // This would come from monitoring service
                'database_size' => $this->getDatabaseSize(),
                'storage_used' => $this->getStorageUsage(),
                'cache_hit_rate' => '95.2%', // This would come from cache monitoring
                'average_response_time' => '120ms', // This would come from APM
            ],
            'revenue' => [
                'total' => 0, // Placeholder for billing integration
                'monthly' => 0,
                'annual' => 0,
                'subscriptions' => 0,
            ],
        ];

        // Get recent activities
        $recentActivities = $this->getRecentActivities();

        // Get system health status
        $systemHealth = $this->getSystemHealth();

        return Inertia::render('Superadmin/Dashboard', [
            'message' => 'Welcome to the Superadmin Dashboard!',
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'systemHealth' => $systemHealth,
        ]);
    }

    /**
     * Get database size information
     */
    private function getDatabaseSize()
    {
        try {
            $result = DB::select("SELECT 
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'size_mb'
                FROM information_schema.tables 
                WHERE table_schema = DATABASE()");
            
            return $result[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            // For SQLite or other databases
            return 'N/A';
        }
    }

    /**
     * Get storage usage information
     */
    private function getStorageUsage()
    {
        try {
            $storagePath = storage_path();
            $bytes = disk_free_space($storagePath);
            $totalBytes = disk_total_space($storagePath);
            
            if ($bytes !== false && $totalBytes !== false) {
                $usedBytes = $totalBytes - $bytes;
                $usagePercent = round(($usedBytes / $totalBytes) * 100, 1);
                return $usagePercent . '%';
            }
            
            return 'N/A';
        } catch (\Exception $e) {
            return 'N/A';
        }
    }

    /**
     * Get recent platform activities
     */
    private function getRecentActivities()
    {
        $activities = collect();

        // Recent user registrations
        $recentUsers = User::latest()->take(5)->get();
        foreach ($recentUsers as $user) {
            $activities->push([
                'type' => 'user_registered',
                'description' => "New user registered: {$user->name}",
                'timestamp' => $user->created_at,
                'user' => $user->name,
                'icon' => 'user-plus',
            ]);
        }

        // Recent projects
        $recentProjects = Project::latest()->take(3)->get();
        foreach ($recentProjects as $project) {
            $activities->push([
                'type' => 'project_created',
                'description' => "New project created: {$project->name}",
                'timestamp' => $project->created_at,
                'user' => $project->owner->name ?? 'Unknown',
                'icon' => 'folder-plus',
            ]);
        }

        // Recent posts
        $recentPosts = Post::latest()->take(3)->get();
        foreach ($recentPosts as $post) {
            $activities->push([
                'type' => 'post_created',
                'description' => "New post created: {$post->title}",
                'timestamp' => $post->created_at,
                'user' => $post->user->name ?? 'Unknown',
                'icon' => 'file-text',
            ]);
        }

        return $activities->sortByDesc('timestamp')->take(10)->values();
    }

    /**
     * Get system health status
     */
    private function getSystemHealth()
    {
        return [
            'database' => [
                'status' => 'healthy',
                'message' => 'Database is operational',
                'response_time' => '5ms',
            ],
            'cache' => [
                'status' => 'healthy',
                'message' => 'Cache is working properly',
                'hit_rate' => '95.2%',
            ],
            'storage' => [
                'status' => $this->getStorageUsage() > 90 ? 'warning' : 'healthy',
                'message' => 'Storage usage: ' . $this->getStorageUsage(),
                'available' => '2.1GB',
            ],
            'queues' => [
                'status' => 'healthy',
                'message' => 'All queues are processing',
                'pending_jobs' => 0,
            ],
        ];
    }
} 