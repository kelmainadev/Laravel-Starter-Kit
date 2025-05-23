# 🔐 Laravel Permissions System - Complete Setup Guide

## 🚀 System Overview

This TaskFlowPro application uses **Spatie Laravel Permission** package for Role-Based Access Control (RBAC) with three distinct user levels:

- **👤 Users**: Regular application users  
- **🛠️ Admins**: Team/workspace managers
- **👑 Superadmins**: Platform administrators

---

## ✅ Current System Status

### ✅ Installed Components

1. **Spatie Laravel Permission** `v6.18.0` - Latest stable version
2. **Middleware Configuration** - Properly registered in `app/Http/Kernel.php`
3. **Database Schema** - All permission tables created and seeded
4. **Test Users** - Demo accounts with assigned roles
5. **Route Protection** - Middleware applied to all protected routes

### ✅ Middleware Registration

```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
    'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
    'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
    'active' => \App\Http\Middleware\EnsureUserIsActive::class,
    // ... other middleware
];
```

### ✅ Database Tables

- `roles` - User roles (user, admin, superadmin)
- `permissions` - System permissions  
- `model_has_roles` - User-role assignments
- `model_has_permissions` - Direct user permissions
- `role_has_permissions` - Role-permission assignments

---

## 🧪 Testing the System

### Command Line Testing

```bash
# Test role system integrity
php artisan test:roles

# Check route registration
php artisan route:list | grep dashboard

# Verify database seeding
php artisan tinker --execute="App\Models\User::with('roles')->get(['id','name','email'])"
```

### Demo Accounts

| Email | Password | Role | Status |
|-------|----------|------|--------|
| `super@admin.com` | `password` | Superadmin | Active |
| `admin@example.com` | `password` | Admin | Active |
| `user@example.com` | `password` | User | Active |

---

## 🛡️ Middleware Usage

### Route Protection Examples

```php
// Single role
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
});

// Multiple roles  
Route::middleware(['auth', 'role:admin|superadmin'])->group(function () {
    Route::resource('users', UserController::class);
});

// Permission-based
Route::middleware(['auth', 'permission:manage users'])->group(function () {
    Route::post('/users/{user}/suspend', [UserController::class, 'suspend']);
});

// Custom middleware stack
Route::middleware(['auth', 'verified', 'role:user', 'active'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index']);
});
```

### Controller Usage

```php
public function __construct()
{
    $this->middleware(['auth', 'role:admin']);
}

public function destroy(User $user)
{
    $this->authorize('delete', $user);
    // or
    if (!auth()->user()->can('delete users')) {
        abort(403);
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. "Target class [role] does not exist"

**Solution:**
```bash
# Clear all caches
php artisan optimize:clear

# Regenerate autoloader
composer dump-autoload

# Rediscover packages
php artisan package:discover --ansi

# Restart server
php artisan serve --port=8002
```

#### 2. Role/Permission Not Working

**Check:**
```bash
# Verify package installation
composer show spatie/laravel-permission

# Check middleware registration
php artisan test:roles

# Verify user roles
php artisan tinker --execute="User::find(1)->getRoleNames()"
```

#### 3. Migration Issues

**Reset:**
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Check tables exist
php artisan tinker --execute="Schema::hasTable('roles')"
```

---

## 📊 Permissions Matrix

### User Permissions

- ✅ View own dashboard
- ✅ Manage own projects/tasks  
- ✅ Upload task attachments
- ✅ Export personal data
- ✅ Receive notifications

### Admin Permissions

- ✅ All User permissions
- ✅ Admin dashboard access
- ✅ Manage team users
- ✅ Moderate content  
- ✅ View team analytics
- ✅ Workspace settings

### Superadmin Permissions

- ✅ All Admin permissions  
- ✅ Superadmin dashboard
- ✅ Manage all users/admins
- ✅ System health monitoring
- ✅ Platform-wide settings
- ✅ Audit logs access

---

## 🚀 Development Commands

### Quick Setup

```bash
# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate:fresh --seed

# Start development servers
php artisan serve --port=8002 &
npm run dev &
```

### Testing

```bash
# Run role system test
php artisan test:roles

# Test specific middleware
php artisan tinker --execute="app('Spatie\Permission\Middleware\RoleMiddleware')"

# Check user permissions
php artisan tinker --execute="User::find(1)->getAllPermissions()->pluck('name')"
```

---

## 🔒 Security Best Practices

1. **Always validate permissions in controllers**
2. **Use policy classes for complex authorization**
3. **Apply middleware at route level, not just controller**
4. **Regular permission audits via `php artisan test:roles`**
5. **Keep roles minimal and permissions granular**
6. **Use role hierarchy: User < Admin < Superadmin**

---

## 📡 API Authentication

For API endpoints, use Laravel Sanctum with role-based tokens:

```php
// Create token with abilities
$token = $user->createToken('api-access', ['user:basic', 'projects:read']);

// Protect API routes
Route::middleware(['auth:sanctum', 'ability:user:basic'])->group(function () {
    Route::get('/api/projects', [ApiProjectController::class, 'index']);
});
```

---

## ✅ Verification Checklist

- [ ] Spatie package installed and configured
- [ ] Middleware aliases registered in Kernel.php  
- [ ] Database tables created and seeded
- [ ] Test users have correct roles assigned
- [ ] Routes protected with appropriate middleware
- [ ] Login/logout functionality working
- [ ] Dashboard access restricted by role
- [ ] All caches cleared and autoloader updated

---

**🎉 Your permissions system is now fully configured and production-ready!**

### Access URLs:
- **Main App**: http://localhost:5177
- **Laravel Backend**: http://localhost:8002  
- **API Documentation**: Available in `README-IMPLEMENTATION.md`

### Support:
Run `php artisan test:roles` anytime to verify system integrity. 