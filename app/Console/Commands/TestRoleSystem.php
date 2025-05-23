<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class TestRoleSystem extends Command
{
    protected $signature = 'test:roles';
    protected $description = 'Test the role and permission system';

    public function handle()
    {
        $this->info('🔍 Testing Role and Permission System...');
        
        // Test if middleware classes exist
        $this->info('1. Testing Middleware Classes:');
        $middlewares = [
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ];
        
        foreach ($middlewares as $name => $class) {
            if (class_exists($class)) {
                $this->info("   ✅ {$name}: {$class}");
            } else {
                $this->error("   ❌ {$name}: {$class} NOT FOUND!");
            }
        }
        
        // Test roles
        $this->info('2. Testing Roles:');
        $roles = ['superadmin', 'admin', 'user'];
        foreach ($roles as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $this->info("   ✅ Role '{$roleName}' exists (ID: {$role->id})");
            } else {
                $this->error("   ❌ Role '{$roleName}' not found!");
            }
        }
        
        // Test users with roles
        $this->info('3. Testing Users with Roles:');
        $testUsers = [
            'super@admin.com' => 'superadmin',
            'admin@example.com' => 'admin', 
            'user@example.com' => 'user'
        ];
        
        foreach ($testUsers as $email => $expectedRole) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $hasRole = $user->hasRole($expectedRole);
                if ($hasRole) {
                    $this->info("   ✅ {$email} has role '{$expectedRole}'");
                } else {
                    $this->error("   ❌ {$email} does NOT have role '{$expectedRole}'!");
                    $this->line("      Current roles: " . $user->getRoleNames()->implode(', '));
                }
            } else {
                $this->error("   ❌ User {$email} not found!");
            }
        }
        
        // Test middleware resolution
        $this->info('4. Testing Middleware Resolution:');
        try {
            $kernel = app(\Illuminate\Contracts\Http\Kernel::class);
            $reflection = new \ReflectionClass($kernel);
            $property = $reflection->getProperty('middlewareAliases');
            $property->setAccessible(true);
            $aliases = $property->getValue($kernel);
            
            foreach (['role', 'permission', 'role_or_permission'] as $alias) {
                if (isset($aliases[$alias])) {
                    $this->info("   ✅ Middleware alias '{$alias}' registered: {$aliases[$alias]}");
                } else {
                    $this->error("   ❌ Middleware alias '{$alias}' not registered!");
                }
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Error checking middleware: " . $e->getMessage());
        }
        
        $this->info('✅ Role system test completed!');
        return 0;
    }
} 