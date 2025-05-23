<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Any authenticated user can view their own posts
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        // Users can view their own posts or published posts
        // Admins and superadmins can view any post
        return $user->id === $post->user_id || 
               $post->status === Post::STATUS_PUBLISHED ||
               $user->hasRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create posts
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        // Users can update their own posts if they are not rejected
        // Admins and superadmins can update any post
        return ($user->id === $post->user_id && $post->status !== Post::STATUS_REJECTED) || 
               $user->hasRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        // Users can delete their own posts
        // Admins and superadmins can delete any post
        return $user->id === $post->user_id || 
               $user->hasRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can moderate the post.
     */
    public function moderate(User $user, Post $post): bool
    {
        // Only admins and superadmins can moderate posts
        return $user->hasRole(['admin', 'superadmin']);
    }
}
