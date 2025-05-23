<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Basic permissions
            'view dashboard',
            'manage own profile',
            'export own data',
            
            // User management
            'view users',
            'create users', 
            'edit users',
            'delete users',
            'suspend users',
            
            // Content management
            'view posts',
            'create posts',
            'edit posts', 
            'delete posts',
            'moderate posts',
            
            // Project management
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',
            'manage project members',
            
            // Task management
            'view tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',
            'assign tasks',
            
            // Admin features
            'view admin dashboard',
            'manage workspace settings',
            'view reports',
            
            // Superadmin features
            'view superadmin dashboard',
            'manage all users',
            'manage system settings',
            'view system health',
            'access audit logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // 1. User Role
        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view dashboard',
            'manage own profile', 
            'export own data',
            'view posts',
            'create posts',
            'edit posts',
            'view projects',
            'create projects',
            'edit projects',
            'manage project members',
            'view tasks',
            'create tasks',
            'edit tasks',
            'assign tasks',
        ]);

        // 2. Admin Role
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            // All user permissions
            'view dashboard',
            'manage own profile',
            'export own data', 
            'view posts',
            'create posts',
            'edit posts',
            'view projects',
            'create projects',
            'edit projects',
            'manage project members',
            'view tasks',
            'create tasks',
            'edit tasks',
            'assign tasks',
            // Plus admin permissions
            'view admin dashboard',
            'view users',
            'create users',
            'edit users',
            'suspend users',
            'delete posts',
            'moderate posts',
            'delete projects',
            'delete tasks',
            'manage workspace settings',
            'view reports',
        ]);

        // 3. Superadmin Role
        $superadminRole = Role::create(['name' => 'superadmin']);
        $superadminRole->givePermissionTo(Permission::all());

        // Create demo users
        
        // Superadmin user
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@admin.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $superadmin->assignRole('superadmin');

        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $admin->assignRole('admin');

        // Regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $user->assignRole('user');

        $this->command->info('Roles and permissions seeder completed successfully!');
        $this->command->info('Created roles: user, admin, superadmin');
        $this->command->info('Created ' . count($permissions) . ' permissions');
        $this->command->info('Created 3 demo users with assigned roles');
    }
} 