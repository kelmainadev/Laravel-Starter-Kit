<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatformSettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'general' => [
                'app_name' => config('app.name', 'TaskFlowPro'),
                'app_url' => config('app.url'),
                'timezone' => config('app.timezone'),
                'maintenance_mode' => false,
                'registration_enabled' => true,
                'email_verification_required' => false,
            ],
            'features' => [
                'user_registration' => true,
                'email_notifications' => true,
                'file_uploads' => true,
                'api_access' => false,
                'two_factor_auth' => false,
            ],
            'limits' => [
                'max_users_per_workspace' => 100,
                'max_projects_per_user' => 50,
                'max_file_size_mb' => 10,
                'api_rate_limit' => 1000,
            ],
        ];

        return Inertia::render('Superadmin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'timezone' => 'required|string',
            'maintenance_mode' => 'boolean',
            'registration_enabled' => 'boolean',
            'email_verification_required' => 'boolean',
        ]);

        // In a real app, you would save these to a settings table or config files
        
        return redirect()->route('superadmin.settings.index')
            ->with('success', 'Platform settings updated successfully.');
    }

    public function security()
    {
        $securitySettings = [
            'password_policy' => [
                'min_length' => 8,
                'require_uppercase' => true,
                'require_lowercase' => true,
                'require_numbers' => true,
                'require_symbols' => false,
            ],
            'session' => [
                'lifetime' => 120,
                'expire_on_close' => false,
                'secure_cookies' => true,
            ],
            'rate_limiting' => [
                'login_attempts' => 5,
                'api_requests' => 1000,
                'password_resets' => 5,
            ],
        ];

        return Inertia::render('Superadmin/Settings/Security', [
            'securitySettings' => $securitySettings,
        ]);
    }

    public function updateSecurity(Request $request)
    {
        $request->validate([
            'min_length' => 'required|integer|min:6|max:50',
            'require_uppercase' => 'boolean',
            'require_lowercase' => 'boolean',
            'require_numbers' => 'boolean',
            'require_symbols' => 'boolean',
            'session_lifetime' => 'required|integer|min:30|max:1440',
            'login_attempts' => 'required|integer|min:3|max:20',
        ]);

        // Save security settings
        
        return redirect()->route('superadmin.settings.security')
            ->with('success', 'Security settings updated successfully.');
    }

    public function email()
    {
        $emailSettings = [
            'driver' => config('mail.default'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'smtp' => [
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'encryption' => config('mail.mailers.smtp.encryption'),
            ],
            'notifications' => [
                'welcome_email' => true,
                'password_reset' => true,
                'email_verification' => true,
                'system_alerts' => true,
            ],
        ];

        return Inertia::render('Superadmin/Settings/Email', [
            'emailSettings' => $emailSettings,
        ]);
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'from_address' => 'required|email',
            'from_name' => 'required|string|max:255',
            'smtp_host' => 'required|string',
            'smtp_port' => 'required|integer',
            'smtp_encryption' => 'required|in:tls,ssl,null',
        ]);

        // Save email settings
        
        return redirect()->route('superadmin.settings.email')
            ->with('success', 'Email settings updated successfully.');
    }
} 