<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SuperadminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles:id,name')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->input('role'), function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => User::count(),
            'active' => User::where('status', User::STATUS_ACTIVE)->count(),
            'suspended' => User::where('status', User::STATUS_SUSPENDED)->count(),
            'superadmins' => User::role('superadmin')->count(),
            'admins' => User::role('admin')->count(),
            'users' => User::role('user')->count(),
        ];

        return Inertia::render('Superadmin/Users/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only('search', 'role', 'status'),
            'roles' => Role::all(['id', 'name']),
        ]);
    }

    public function create()
    {
        $roles = Role::all(['id', 'name']);
        
        return Inertia::render('Superadmin/Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'status' => 'required|in:active,suspended,inactive',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status,
            'email_verified_at' => now(), // Auto-verify for superadmin created users
        ]);

        $user->assignRole($request->role);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $user->load(['roles', 'posts', 'ownedProjects', 'projects']);

        $userStats = [
            'posts_count' => $user->posts()->count(),
            'projects_owned' => $user->ownedProjects()->count(),
            'projects_member' => $user->projects()->count(),
            'tasks_created' => $user->createdTasks()->count(),
            'tasks_assigned' => $user->assignedTasks()->count(),
        ];

        return Inertia::render('Superadmin/Users/Show', [
            'user' => $user,
            'userStats' => $userStats,
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::all(['id', 'name']);
        
        return Inertia::render('Superadmin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,name',
            'status' => 'required|in:active,suspended,inactive',
            'password' => $request->password ? ['required', 'confirmed', Rules\Password::defaults()] : '',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'status' => $request->status,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        // Sync roles
        $user->syncRoles([$request->role]);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent deletion of the current superadmin
        if ($user->id === auth()->id()) {
            return redirect()->route('superadmin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('superadmin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function toggleStatus(User $user)
    {
        // Prevent changing status of the current superadmin
        if ($user->id === auth()->id()) {
            return redirect()->route('superadmin.users.index')
                ->with('error', 'You cannot change your own status.');
        }

        $newStatus = $user->status === User::STATUS_ACTIVE 
            ? User::STATUS_SUSPENDED 
            : User::STATUS_ACTIVE;

        $user->update(['status' => $newStatus]);

        $message = $newStatus === User::STATUS_ACTIVE 
            ? 'User activated successfully.' 
            : 'User suspended successfully.';

        return redirect()->route('superadmin.users.index')
            ->with('success', $message);
    }

    public function ban(User $user)
    {
        // Prevent banning the current superadmin
        if ($user->id === auth()->id()) {
            return redirect()->route('superadmin.users.index')
                ->with('error', 'You cannot ban your own account.');
        }

        $user->update(['status' => User::STATUS_SUSPENDED]);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'User banned successfully.');
    }

    public function unban(User $user)
    {
        $user->update(['status' => User::STATUS_ACTIVE]);

        return redirect()->route('superadmin.users.index')
            ->with('success', 'User unbanned successfully.');
    }
} 