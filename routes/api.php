<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication management routes
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('ability:user:update');
        Route::put('/change-password', [AuthController::class, 'changePassword'])->middleware('ability:user:update');
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        
        // Token management
        Route::get('/tokens', [AuthController::class, 'tokens']);
        Route::post('/tokens', [AuthController::class, 'createToken']);
        Route::delete('/tokens/{token}', [AuthController::class, 'revokeToken']);
    });

    // Project management routes
    Route::prefix('projects')->middleware('ability:projects:read')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::get('/{project}', [ProjectController::class, 'show']);
        Route::get('/{project}/statistics', [ProjectController::class, 'statistics']);
        
        // Routes requiring create abilities
        Route::middleware('ability:projects:create')->group(function () {
            Route::post('/', [ProjectController::class, 'store']);
        });
        
        // Routes requiring the user to be project owner (checked in controller)
        Route::put('/{project}', [ProjectController::class, 'update']);
        Route::delete('/{project}', [ProjectController::class, 'destroy']);
        
        // Member management
        Route::post('/{project}/members', [ProjectController::class, 'addMember']);
        Route::delete('/{project}/members/{user}', [ProjectController::class, 'removeMember']);
    });

    // Task management routes
    Route::prefix('tasks')->middleware('ability:tasks:read')->group(function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::get('/statistics', [TaskController::class, 'statistics']);
        Route::get('/{task}', [TaskController::class, 'show']);
        
        // Routes requiring create abilities
        Route::middleware('ability:tasks:create')->group(function () {
            Route::post('/', [TaskController::class, 'store']);
        });
        
        // Routes requiring edit permissions (checked in controller)
        Route::put('/{task}', [TaskController::class, 'update']);
        Route::delete('/{task}', [TaskController::class, 'destroy']);
        Route::patch('/{task}/complete', [TaskController::class, 'markCompleted']);
        Route::patch('/{task}/progress', [TaskController::class, 'updateProgress']);
    });

    // User management routes (admin and superadmin)
    Route::prefix('users')->middleware('ability:users:read')->group(function () {
        Route::get('/', function (Request $request) {
            $users = \App\Models\User::select('id', 'name', 'email', 'status', 'created_at')
                ->when($request->has('search'), function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                          ->orWhere('email', 'like', "%{$request->search}%");
                    });
                })
                ->when($request->has('status'), function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->when($request->has('role'), function ($query) use ($request) {
                    $query->whereHas('roles', function ($q) use ($request) {
                        $q->where('name', $request->role);
                    });
                })
                ->with('roles:id,name')
                ->orderBy('created_at', 'desc')
                ->paginate(min($request->input('per_page', 15), 100));

            return response()->json([
                'users' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ]);
        });
        
        Route::get('/{user}', function (\App\Models\User $user) {
            $user->load('roles:id,name', 'permissions:id,name');
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'roles' => $user->roles,
                    'permissions' => $user->permissions,
                    'created_at' => $user->created_at->toISOString(),
                    'updated_at' => $user->updated_at->toISOString(),
                ]
            ]);
        });
        
        // User modification routes
        Route::middleware('ability:users:update')->group(function () {
            Route::put('/{user}', function (Request $request, \App\Models\User $user) {
                $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                    'status' => 'required|in:active,suspended,inactive',
                ]);

                $user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'status' => $request->status,
                ]);

                return response()->json([
                    'message' => 'User updated successfully',
                    'user' => $user
                ]);
            });
        });
        
        // User creation and deletion (superadmin only)
        Route::middleware('ability:users:create')->group(function () {
            Route::post('/', function (Request $request) {
                $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'password' => 'required|string|min:8',
                    'role' => 'required|in:user,admin,superadmin',
                    'status' => 'sometimes|in:active,suspended,inactive',
                ]);

                $user = \App\Models\User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'status' => $request->input('status', \App\Models\User::STATUS_ACTIVE),
                ]);

                $user->assignRole($request->role);

                return response()->json([
                    'message' => 'User created successfully',
                    'user' => $user
                ], 201);
            });
        });
        
        Route::middleware('ability:users:delete')->group(function () {
            Route::delete('/{user}', function (\App\Models\User $user) {
                // Prevent deleting the last superadmin
                if ($user->hasRole('superadmin')) {
                    $superadminCount = \App\Models\User::whereHas('roles', function ($query) {
                        $query->where('name', 'superadmin');
                    })->count();
                    
                    if ($superadminCount <= 1) {
                        return response()->json([
                            'message' => 'Cannot delete the last superadmin user.'
                        ], 422);
                    }
                }

                $user->delete();

                return response()->json([
                    'message' => 'User deleted successfully'
                ]);
            });
        });
    });

    // System health routes (superadmin only)
    Route::prefix('system')->middleware('ability:system:read')->group(function () {
        Route::get('/health', function () {
            return response()->json([
                'status' => 'healthy',
                'timestamp' => now()->toISOString(),
                'database' => [
                    'status' => 'connected',
                    'users_count' => \App\Models\User::count(),
                    'projects_count' => \App\Models\Project::count(),
                    'tasks_count' => \App\Models\Task::count(),
                ],
                'cache' => [
                    'status' => 'available',
                ],
                'queue' => [
                    'status' => 'running',
                    'pending_jobs' => 0, // Could integrate with actual queue monitoring
                ],
            ]);
        });
        
        Route::get('/stats', function () {
            return response()->json([
                'users' => [
                    'total' => \App\Models\User::count(),
                    'active' => \App\Models\User::where('status', 'active')->count(),
                    'suspended' => \App\Models\User::where('status', 'suspended')->count(),
                    'by_role' => [
                        'users' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'user'))->count(),
                        'admins' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->count(),
                        'superadmins' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'superadmin'))->count(),
                    ]
                ],
                'projects' => [
                    'total' => \App\Models\Project::count(),
                    'by_status' => [
                        'planning' => \App\Models\Project::where('status', 'planning')->count(),
                        'active' => \App\Models\Project::where('status', 'active')->count(),
                        'completed' => \App\Models\Project::where('status', 'completed')->count(),
                        'cancelled' => \App\Models\Project::where('status', 'cancelled')->count(),
                    ]
                ],
                'tasks' => [
                    'total' => \App\Models\Task::count(),
                    'by_status' => [
                        'todo' => \App\Models\Task::where('status', 'todo')->count(),
                        'in_progress' => \App\Models\Task::where('status', 'in_progress')->count(),
                        'completed' => \App\Models\Task::where('status', 'completed')->count(),
                        'overdue' => \App\Models\Task::overdue()->count(),
                    ]
                ]
            ]);
        });
    });
}); 