<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class PerformanceController extends Controller
{
    public function index()
    {
        $performanceData = [
            'overview' => [
                'average_response_time' => '120ms',
                'memory_usage' => '45%',
                'cpu_usage' => '23%',
                'cache_hit_rate' => '95.2%',
                'error_rate' => '0.1%',
            ],
        ];

        return Inertia::render('Superadmin/Performance/Index', [
            'performanceData' => $performanceData,
        ]);
    }

    public function clearCache()
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            return redirect()->route('superadmin.performance.index')
                ->with('success', 'All caches cleared successfully.');
        } catch (\Exception $e) {
            return redirect()->route('superadmin.performance.index')
                ->with('error', 'Failed to clear cache.');
        }
    }

    public function optimize()
    {
        try {
            Artisan::call('config:cache');
            Artisan::call('route:cache');
            Artisan::call('view:cache');

            return redirect()->route('superadmin.performance.index')
                ->with('success', 'Application optimized successfully.');
        } catch (\Exception $e) {
            return redirect()->route('superadmin.performance.index')
                ->with('error', 'Failed to optimize application.');
        }
    }
} 