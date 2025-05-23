<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Protected user routes - accessible by user, admin, and superadmin
Route::middleware(['auth', 'verified', 'role_or_permission:user|admin|superadmin', 'active'])->name('user.')->group(function () {
    Route::get('dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    
    // Task Management routes
    Route::resource('projects', \App\Http\Controllers\User\ProjectController::class);
    Route::post('projects/{project}/members', [\App\Http\Controllers\User\ProjectController::class, 'addMember'])->name('projects.add-member');
    Route::delete('projects/{project}/members/{user}', [\App\Http\Controllers\User\ProjectController::class, 'removeMember'])->name('projects.remove-member');
    
    Route::resource('tasks', \App\Http\Controllers\User\TaskController::class);
    Route::patch('tasks/{task}/complete', [\App\Http\Controllers\User\TaskController::class, 'markCompleted'])->name('tasks.complete');
    Route::patch('tasks/{task}/progress', [\App\Http\Controllers\User\TaskController::class, 'updateProgress'])->name('tasks.progress');
    
    // Task attachment routes
    Route::prefix('tasks/{task}/attachments')->name('tasks.attachments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\TaskAttachmentController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\User\TaskAttachmentController::class, 'store'])->name('store');
        Route::get('/{media}/download', [\App\Http\Controllers\User\TaskAttachmentController::class, 'download'])->name('download');
        Route::get('/{media}/preview', [\App\Http\Controllers\User\TaskAttachmentController::class, 'preview'])->name('preview');
        Route::delete('/{media}', [\App\Http\Controllers\User\TaskAttachmentController::class, 'destroy'])->name('destroy');
    });
    
    // Post management routes
    Route::resource('posts', \App\Http\Controllers\User\PostController::class);
    Route::post('posts/{post}/report', [\App\Http\Controllers\User\PostController::class, 'report'])->name('posts.report');
    
    // Data export routes
    Route::get('export/posts/csv', [\App\Http\Controllers\User\UserExportController::class, 'exportPostsCsv'])->name('export.posts.csv');
    Route::get('export/profile/json', [\App\Http\Controllers\User\UserExportController::class, 'exportProfileJson'])->name('export.profile.json');
    
    // Notification routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\NotificationController::class, 'index'])->name('index');
        Route::get('/unread-count', [\App\Http\Controllers\User\NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::patch('/{notification}/read', [\App\Http\Controllers\User\NotificationController::class, 'markAsRead'])->name('mark-as-read');
        Route::patch('/mark-all-read', [\App\Http\Controllers\User\NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::delete('/{notification}', [\App\Http\Controllers\User\NotificationController::class, 'destroy'])->name('destroy');
        Route::delete('/clear-read', [\App\Http\Controllers\User\NotificationController::class, 'clearRead'])->name('clear-read');
    });
});

// Include other route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';     // Include admin routes
require __DIR__.'/superadmin.php'; // Include superadmin routes
