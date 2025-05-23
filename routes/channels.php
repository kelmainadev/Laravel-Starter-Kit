<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// User-specific notification channel
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Project-specific channels
Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    // Check if user is project owner or member
    $project = \App\Models\Project::find($projectId);
    return $project && $project->canUserAccess($user->id);
});

// Task-specific channels  
Broadcast::channel('task.{taskId}', function ($user, $taskId) {
    // Check if user can access the task
    $task = \App\Models\Task::find($taskId);
    return $task && $task->canUserAccess($user->id);
});

// Admin channels
Broadcast::channel('admin', function ($user) {
    return $user->hasRole(['admin', 'superadmin']);
});

// Superadmin channels
Broadcast::channel('superadmin', function ($user) {
    return $user->hasRole('superadmin');
}); 