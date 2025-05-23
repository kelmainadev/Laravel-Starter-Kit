<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;

Route::middleware(['auth', 'role_or_permission:admin|superadmin', 'active'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // User management routes
    Route::resource('users', AdminUserController::class);
    Route::put('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
    
    // Content moderation routes
    Route::get('/moderation', [App\Http\Controllers\Admin\ContentModerationController::class, 'index'])->name('moderation.index');
    Route::get('/moderation/all', [App\Http\Controllers\Admin\ContentModerationController::class, 'all'])->name('moderation.all');
    Route::get('/moderation/{post}', [App\Http\Controllers\Admin\ContentModerationController::class, 'show'])->name('moderation.show');
    Route::put('/moderation/{post}/approve', [App\Http\Controllers\Admin\ContentModerationController::class, 'approve'])->name('moderation.approve');
    Route::put('/moderation/{post}/reject', [App\Http\Controllers\Admin\ContentModerationController::class, 'reject'])->name('moderation.reject');
    Route::put('/moderation/{post}/flag', [App\Http\Controllers\Admin\ContentModerationController::class, 'flag'])->name('moderation.flag');
    Route::delete('/moderation/{post}', [App\Http\Controllers\Admin\ContentModerationController::class, 'destroy'])->name('moderation.destroy');
}); 