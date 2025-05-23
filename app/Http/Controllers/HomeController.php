<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the welcome page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Welcome');
    }
} 