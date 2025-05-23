<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if ($user && !$user->isActive()) {
            Auth::logout();
            
            $message = $user->isSuspended() 
                ? 'Your account has been suspended. Please contact an administrator.' 
                : 'Your account is inactive. Please contact an administrator.';
            
            return redirect()->route('login')->with('error', $message);
        }
        
        return $next($request);
    }
} 