<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Superadmin\SuperadminDashboardController;
// use App\Http\Controllers\Superadmin\SystemHealthController; // Example

Route::middleware(['auth', 'role:superadmin', 'active'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperadminDashboardController::class, 'index'])->name('dashboard');
    // Example route for system health
    // Route::get('/system-health', [SystemHealthController::class, 'health'])->name('system.health');
}); 