<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperadminDashboardController extends Controller
{
    public function index()
    {
        // Pass any necessary data to the Inertia view
        return Inertia::render('Superadmin/Dashboard', [
            'message' => 'Welcome to the Superadmin Dashboard!',
        ]);
    }
} 