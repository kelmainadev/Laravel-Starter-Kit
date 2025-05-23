<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Superadmin\SuperadminDashboardController;
use App\Http\Controllers\Superadmin\WorkspaceController;
use App\Http\Controllers\Superadmin\SystemHealthController;
use App\Http\Controllers\Superadmin\BillingController;
use App\Http\Controllers\Superadmin\AuditLogController;
use App\Http\Controllers\Superadmin\SuperadminUserController;
use App\Http\Controllers\Superadmin\PlatformSettingsController;
use App\Http\Controllers\Superadmin\FeatureFlagController;
use App\Http\Controllers\Superadmin\PerformanceController;

Route::middleware(['auth', 'role:superadmin', 'active'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperadminDashboardController::class, 'index'])->name('dashboard');
    
    // Workspace Management
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::get('/workspaces/create', [WorkspaceController::class, 'create'])->name('workspaces.create');
    Route::post('/workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
    Route::get('/workspaces/{workspace}', [WorkspaceController::class, 'show'])->name('workspaces.show');
    Route::get('/workspaces/{workspace}/edit', [WorkspaceController::class, 'edit'])->name('workspaces.edit');
    Route::put('/workspaces/{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
    Route::delete('/workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
    Route::put('/workspaces/{workspace}/toggle-status', [WorkspaceController::class, 'toggleStatus'])->name('workspaces.toggle-status');
    
    // System Health
    Route::get('/system-health', [SystemHealthController::class, 'index'])->name('system-health.index');
    Route::get('/system-health/database', [SystemHealthController::class, 'database'])->name('system-health.database');
    Route::get('/system-health/queues', [SystemHealthController::class, 'queues'])->name('system-health.queues');
    Route::get('/system-health/storage', [SystemHealthController::class, 'storage'])->name('system-health.storage');
    Route::get('/system-health/performance', [SystemHealthController::class, 'performance'])->name('system-health.performance');
    
    // Billing Overview
    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    Route::get('/billing/subscriptions', [BillingController::class, 'subscriptions'])->name('billing.subscriptions');
    Route::get('/billing/transactions', [BillingController::class, 'transactions'])->name('billing.transactions');
    Route::get('/billing/revenue', [BillingController::class, 'revenue'])->name('billing.revenue');
    
    // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/audit-logs/{log}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    Route::delete('/audit-logs/{log}', [AuditLogController::class, 'destroy'])->name('audit-logs.destroy');
    Route::post('/audit-logs/clear-old', [AuditLogController::class, 'clearOld'])->name('audit-logs.clear-old');
    
    // All Users Management
    Route::get('/users', [SuperadminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [SuperadminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [SuperadminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [SuperadminUserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [SuperadminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [SuperadminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [SuperadminUserController::class, 'destroy'])->name('users.destroy');
    Route::put('/users/{user}/toggle-status', [SuperadminUserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::put('/users/{user}/ban', [SuperadminUserController::class, 'ban'])->name('users.ban');
    Route::put('/users/{user}/unban', [SuperadminUserController::class, 'unban'])->name('users.unban');
    
    // Platform Settings
    Route::get('/settings', [PlatformSettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [PlatformSettingsController::class, 'update'])->name('settings.update');
    Route::get('/settings/security', [PlatformSettingsController::class, 'security'])->name('settings.security');
    Route::put('/settings/security', [PlatformSettingsController::class, 'updateSecurity'])->name('settings.security.update');
    Route::get('/settings/email', [PlatformSettingsController::class, 'email'])->name('settings.email');
    Route::put('/settings/email', [PlatformSettingsController::class, 'updateEmail'])->name('settings.email.update');
    
    // Feature Flags
    Route::get('/feature-flags', [FeatureFlagController::class, 'index'])->name('feature-flags.index');
    Route::post('/feature-flags', [FeatureFlagController::class, 'store'])->name('feature-flags.store');
    Route::put('/feature-flags/{flag}', [FeatureFlagController::class, 'update'])->name('feature-flags.update');
    Route::delete('/feature-flags/{flag}', [FeatureFlagController::class, 'destroy'])->name('feature-flags.destroy');
    Route::put('/feature-flags/{flag}/toggle', [FeatureFlagController::class, 'toggle'])->name('feature-flags.toggle');
    
    // Performance Monitoring
    Route::get('/performance', [PerformanceController::class, 'index'])->name('performance.index');
    Route::get('/performance/metrics', [PerformanceController::class, 'metrics'])->name('performance.metrics');
    Route::get('/performance/logs', [PerformanceController::class, 'logs'])->name('performance.logs');
    Route::post('/performance/clear-cache', [PerformanceController::class, 'clearCache'])->name('performance.clear-cache');
    Route::post('/performance/optimize', [PerformanceController::class, 'optimize'])->name('performance.optimize');
}); 