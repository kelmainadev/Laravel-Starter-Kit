<?php

namespace App\Bootstrap;

use Illuminate\Foundation\Application;
use Illuminate\Contracts\Foundation\Application as ApplicationContract;
use Illuminate\Support\Facades\Route;

class LoadAdminRoutes
{
    /**
     * Bootstrap the given application.
     */
    public function bootstrap(ApplicationContract|Application $app): void
    {
        Route::middleware('web')
            ->group(base_path('routes/admin.php'));

        Route::middleware('web')
            ->group(base_path('routes/superadmin.php'));
    }
} 