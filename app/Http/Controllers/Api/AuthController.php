<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user account is active
        if (!$user->isActive()) {
            return response()->json([
                'message' => 'Your account is not active. Please contact support.'
            ], 403);
        }

        // Create token with abilities based on user role
        $abilities = $this->getTokenAbilities($user);
        $token = $user->createToken($request->device_name, $abilities);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
            'token' => $token->plainTextToken,
            'abilities' => $abilities,
        ]);
    }

    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'device_name' => 'required|string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => User::STATUS_ACTIVE,
        ]);

        // Assign default user role
        $user->assignRole('user');

        // Create token
        $abilities = $this->getTokenAbilities($user);
        $token = $user->createToken($request->device_name, $abilities);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
            'token' => $token->plainTextToken,
            'abilities' => $abilities,
        ], 201);
    }

    /**
     * Get the authenticated user
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Get user's API tokens
     */
    public function tokens(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $tokens = $user->tokens()->get()->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'abilities' => $token->abilities,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
            ];
        });

        return response()->json([
            'tokens' => $tokens
        ]);
    }

    /**
     * Create a new API token
     */
    public function createToken(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'array',
            'abilities.*' => 'string'
        ]);

        $user = $request->user();
        $userAbilities = $this->getTokenAbilities($user);
        
        // Only allow abilities that the user has
        $requestedAbilities = $request->input('abilities', $userAbilities);
        $abilities = array_intersect($requestedAbilities, $userAbilities);

        $token = $user->createToken($request->name, $abilities);

        return response()->json([
            'message' => 'Token created successfully',
            'token' => $token->plainTextToken,
            'abilities' => $abilities,
        ]);
    }

    /**
     * Revoke an API token
     */
    public function revokeToken(Request $request, $tokenId): JsonResponse
    {
        $user = $request->user();
        
        $token = $user->tokens()->where('id', $tokenId)->first();

        if (!$token) {
            return response()->json([
                'message' => 'Token not found'
            ], 404);
        }

        $token->delete();

        return response()->json([
            'message' => 'Token revoked successfully'
        ]);
    }

    /**
     * Logout (revoke current token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices successfully'
        ]);
    }

    /**
     * Get token abilities based on user role
     */
    private function getTokenAbilities(User $user): array
    {
        $abilities = [
            // Basic abilities for all users
            'user:read',
            'user:update',
            'projects:read',
            'projects:create',
            'tasks:read',
            'tasks:create',
            'notifications:read',
            'notifications:update',
        ];

        // Add role-specific abilities
        if ($user->hasRole('admin')) {
            $abilities = array_merge($abilities, [
                'admin:read',
                'users:read',
                'users:update',
                'projects:admin',
                'tasks:admin',
            ]);
        }

        if ($user->hasRole('superadmin')) {
            $abilities = array_merge($abilities, [
                'superadmin:read',
                'users:create',
                'users:delete',
                'admin:create',
                'admin:delete',
                'system:read',
                'system:update',
            ]);
        }

        return array_unique($abilities);
    }
}
