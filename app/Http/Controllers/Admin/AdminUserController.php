<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $users = User::with('roles:id,name')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::where('name', '!=', 'superadmin')->get(['id', 'name']);
        
        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user.
     */
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
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $roles = Role::where('name', '!=', 'superadmin')->get(['id', 'name']);
        $user->load('roles:id,name');

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'userRole' => $user->roles->first()?->name,
        ]);
    }

    /**
     * Update the specified user.
     */
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

        // Sync roles (remove old ones and assign new ones)
        $user->syncRoles([$request->role]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of superadmin users
        if ($user->hasRole('superadmin')) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Superadmin users cannot be deleted.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle user status (active/suspended).
     */
    public function toggleStatus(User $user)
    {
        // Prevent changing status of superadmin users
        if ($user->hasRole('superadmin')) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Superadmin status cannot be changed.');
        }

        $newStatus = $user->status === User::STATUS_ACTIVE 
            ? User::STATUS_SUSPENDED 
            : User::STATUS_ACTIVE;

        $user->update(['status' => $newStatus]);

        $message = $newStatus === User::STATUS_ACTIVE 
            ? 'User activated successfully.' 
            : 'User suspended successfully.';

        return redirect()->route('admin.users.index')
            ->with('success', $message);
    }
} 