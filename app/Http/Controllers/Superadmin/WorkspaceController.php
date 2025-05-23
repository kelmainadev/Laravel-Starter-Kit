<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index()
    {
        // For now, we'll show a placeholder workspace management page
        // In a real multi-tenant app, this would list all workspaces
        $workspaces = [
            [
                'id' => 1,
                'name' => 'Default Workspace',
                'domain' => 'localhost',
                'status' => 'active',
                'users_count' => \App\Models\User::count(),
                'created_at' => now()->subDays(30),
                'updated_at' => now(),
            ]
        ];

        return Inertia::render('Superadmin/Workspaces/Index', [
            'workspaces' => $workspaces,
        ]);
    }

    public function create()
    {
        return Inertia::render('Superadmin/Workspaces/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:workspaces,domain',
            'description' => 'nullable|string',
        ]);

        // In a real multi-tenant app, you would create a workspace here
        // For now, we'll just redirect back with a success message
        
        return redirect()->route('superadmin.workspaces.index')
            ->with('success', 'Workspace created successfully.');
    }

    public function show($workspace)
    {
        // Show workspace details
        $workspaceData = [
            'id' => 1,
            'name' => 'Default Workspace',
            'domain' => 'localhost',
            'status' => 'active',
            'users_count' => \App\Models\User::count(),
            'projects_count' => \App\Models\Project::count(),
            'tasks_count' => \App\Models\Task::count(),
            'created_at' => now()->subDays(30),
            'updated_at' => now(),
        ];

        return Inertia::render('Superadmin/Workspaces/Show', [
            'workspace' => $workspaceData,
        ]);
    }

    public function edit($workspace)
    {
        $workspaceData = [
            'id' => 1,
            'name' => 'Default Workspace',
            'domain' => 'localhost',
            'status' => 'active',
            'description' => 'Default workspace for the application',
        ];

        return Inertia::render('Superadmin/Workspaces/Edit', [
            'workspace' => $workspaceData,
        ]);
    }

    public function update(Request $request, $workspace)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,suspended',
        ]);

        // In a real multi-tenant app, you would update the workspace here
        
        return redirect()->route('superadmin.workspaces.index')
            ->with('success', 'Workspace updated successfully.');
    }

    public function destroy($workspace)
    {
        // In a real multi-tenant app, you would delete the workspace here
        // This is a dangerous operation and should have additional safeguards
        
        return redirect()->route('superadmin.workspaces.index')
            ->with('success', 'Workspace deleted successfully.');
    }

    public function toggleStatus($workspace)
    {
        // Toggle workspace status between active and inactive
        
        return redirect()->route('superadmin.workspaces.index')
            ->with('success', 'Workspace status updated successfully.');
    }
} 