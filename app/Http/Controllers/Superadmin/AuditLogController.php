<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        // Placeholder audit logs - in a real app, you'd use a package like owen-it/laravel-auditing
        $auditLogs = collect([
            [
                'id' => 1,
                'user_name' => 'Super Admin',
                'action' => 'user.created',
                'description' => 'Created new user: John Doe',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0...',
                'created_at' => now()->subMinutes(30),
            ],
            [
                'id' => 2,
                'user_name' => 'Admin User',
                'action' => 'post.updated',
                'description' => 'Updated post: Sample Post Title',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0...',
                'created_at' => now()->subHours(2),
            ],
            [
                'id' => 3,
                'user_name' => 'Regular User',
                'action' => 'profile.updated',
                'description' => 'Updated profile information',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0...',
                'created_at' => now()->subHours(5),
            ],
        ]);

        return Inertia::render('Superadmin/AuditLogs/Index', [
            'auditLogs' => $auditLogs,
            'filters' => $request->only('search', 'action', 'date_from', 'date_to'),
        ]);
    }

    public function show($log)
    {
        $auditLog = [
            'id' => $log,
            'user_name' => 'Super Admin',
            'action' => 'user.created',
            'description' => 'Created new user: John Doe',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'old_values' => [],
            'new_values' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'status' => 'active',
            ],
            'created_at' => now()->subMinutes(30),
        ];

        return Inertia::render('Superadmin/AuditLogs/Show', [
            'auditLog' => $auditLog,
        ]);
    }

    public function destroy($log)
    {
        // In a real app, you might want to restrict deletion of audit logs
        return redirect()->route('superadmin.audit-logs.index')
            ->with('success', 'Audit log deleted successfully.');
    }

    public function clearOld(Request $request)
    {
        $request->validate([
            'days' => 'required|integer|min:30|max:365',
        ]);

        // In a real app, you would delete logs older than specified days
        
        return redirect()->route('superadmin.audit-logs.index')
            ->with('success', "Audit logs older than {$request->days} days have been cleared.");
    }
} 