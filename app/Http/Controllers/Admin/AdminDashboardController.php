<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Pass any necessary data to the Inertia view
        return Inertia::render('Admin/Dashboard', [
            'message' => 'Welcome to the Admin Dashboard!',
        ]);
    }
} 