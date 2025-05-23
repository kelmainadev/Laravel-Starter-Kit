<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeatureFlagController extends Controller
{
    public function index()
    {
        // Placeholder feature flags - in a real app, you'd store these in database
        $featureFlags = collect([
            [
                'id' => 1,
                'name' => 'new_dashboard',
                'description' => 'Enable the new dashboard design',
                'enabled' => true,
                'rollout_percentage' => 100,
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(2),
            ],
            [
                'id' => 2,
                'name' => 'advanced_analytics',
                'description' => 'Enable advanced analytics features',
                'enabled' => false,
                'rollout_percentage' => 0,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(1),
            ],
            [
                'id' => 3,
                'name' => 'ai_suggestions',
                'description' => 'Enable AI-powered task suggestions',
                'enabled' => true,
                'rollout_percentage' => 25,
                'created_at' => now()->subDays(3),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'real_time_notifications',
                'description' => 'Enable real-time push notifications',
                'enabled' => true,
                'rollout_percentage' => 75,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subHours(6),
            ],
        ]);

        return Inertia::render('Superadmin/FeatureFlags/Index', [
            'featureFlags' => $featureFlags,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:feature_flags,name',
            'description' => 'required|string|max:500',
            'enabled' => 'boolean',
            'rollout_percentage' => 'required|integer|min:0|max:100',
        ]);

        // In a real app, you would create the feature flag in the database
        
        return redirect()->route('superadmin.feature-flags.index')
            ->with('success', 'Feature flag created successfully.');
    }

    public function update(Request $request, $flag)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'enabled' => 'boolean',
            'rollout_percentage' => 'required|integer|min:0|max:100',
        ]);

        // In a real app, you would update the feature flag in the database
        
        return redirect()->route('superadmin.feature-flags.index')
            ->with('success', 'Feature flag updated successfully.');
    }

    public function destroy($flag)
    {
        // In a real app, you would delete the feature flag from the database
        
        return redirect()->route('superadmin.feature-flags.index')
            ->with('success', 'Feature flag deleted successfully.');
    }

    public function toggle($flag)
    {
        // In a real app, you would toggle the feature flag status
        
        return redirect()->route('superadmin.feature-flags.index')
            ->with('success', 'Feature flag toggled successfully.');
    }
} 