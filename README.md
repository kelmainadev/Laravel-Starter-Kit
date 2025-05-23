# 🚀 TaskFlowPro Starter Kit

*A scalable, production-ready Laravel starter application with full user authentication, admin dashboards, and superadmin controls — ideal for SaaS, internal tools, client dashboards, or marketplaces.*

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-purple.svg)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-teal.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles & Permissions](#-user-roles--permissions)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧱 Overview

TaskFlowPro is a comprehensive Laravel starter kit that provides a solid foundation for building modern web applications. It includes a complete authentication system, role-based access control, and separate dashboards for different user types.

### Perfect For:
- 🏢 **SaaS Applications** - Multi-tenant ready with billing integration
- 🛠️ **Internal Tools** - Team collaboration and project management
- 👥 **Client Dashboards** - Customer portals and service management
- 🛒 **Marketplaces** - Multi-vendor platforms with admin oversight
- 📊 **Business Applications** - CRM, ERP, and workflow management

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ Complete user registration and login system
- ✅ Email verification and password reset
- ✅ Role-based access control (RBAC) using Spatie
- ✅ Multi-level access: User, Admin, Superadmin
- ✅ Account status management (active/suspended/inactive)
- ✅ Profile management with avatar uploads
- ✅ CSRF protection and input validation
- ✅ Rate limiting and brute force protection

### 👥 User Management
- ✅ User registration and profile management
- ✅ Avatar upload with automatic fallback generation
- ✅ Profile completion tracking
- ✅ Account status management
- ✅ Email verification system

### 📊 Dashboard Features
- ✅ **User Dashboard** - Personal task overview and quick actions
- ✅ **Admin Dashboard** - Team management and content moderation
- ✅ **Superadmin Dashboard** - Platform-wide control and monitoring
- ✅ Real-time statistics and analytics
- ✅ Recent activity tracking
- ✅ System health monitoring

### 📝 Content Management
- ✅ **Projects** - Create, manage, and collaborate on projects
- ✅ **Tasks** - Comprehensive task management with priorities and status
- ✅ **Posts** - Content creation with moderation workflow
- ✅ File uploads and media management
- ✅ Content moderation system

### 🛡️ Admin Features
- ✅ User management (create, edit, suspend, delete)
- ✅ Content moderation (approve, reject, flag)
- ✅ Role assignment and permission management
- ✅ Workspace settings and configuration
- ✅ Analytics and reporting

### 👑 Superadmin Features
- ✅ **Platform Control** - Complete system oversight
- ✅ **User Management** - Manage all users across the platform
- ✅ **System Health** - Monitor database, cache, storage, and performance
- ✅ **Audit Logs** - Track all user activities and system changes
- ✅ **Billing Overview** - Revenue tracking and subscription management
- ✅ **Platform Settings** - Configure system-wide settings
- ✅ **Feature Flags** - Control feature rollouts and A/B testing
- ✅ **Performance Monitoring** - System optimization and cache management

### 🎨 UI/UX Features
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Dark/light mode support (ready for implementation)
- ✅ Mobile-first responsive layout
- ✅ Accessible components with proper ARIA labels
- ✅ Loading states and error handling
- ✅ Toast notifications and alerts

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12.x** - PHP framework
- **MySQL/SQLite** - Database
- **Spatie Laravel-Permission** - Role and permission management
- **Laravel Sanctum** - API authentication
- **Laravel Queue** - Background job processing

### Frontend
- **React 18.x** - JavaScript library
- **Inertia.js** - Modern monolith approach
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

### Development Tools
- **Vite** - Fast build tool
- **ESLint & Prettier** - Code formatting and linting
- **Laravel Pint** - PHP code style fixer
- **Pest** - Testing framework

---

## 👥 User Roles & Permissions

### 1. 👤 **Users** (Regular Users)
**Permissions:**
- Register/login/logout
- Update profile and change password
- Access personalized dashboard
- Create/read/update/delete their own data
- Manage projects and tasks
- Create and edit posts
- Export personal data

### 2. 🛠️ **Admins** (Team Managers)
**Permissions (plus all User permissions):**
- Access admin dashboard
- Manage users within their workspace
- Assign or revoke user roles
- Moderate content (approve, reject, flag)
- Access workspace-level reports
- Configure workspace settings

### 3. 👑 **Superadmins** (Platform Administrators)
**Permissions (plus all Admin permissions):**
- Access superadmin dashboard
- Manage all workspaces and admins
- Approve or ban accounts platform-wide
- Monitor system performance and health
- Control platform-wide settings and feature flags
- View audit logs and user activities
- Manage subscriptions and billing

---

## 🚀 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+ or SQLite
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflowpro-starter.git
   cd taskflowpro-starter
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   ```bash
   # Edit .env file with your database credentials
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=taskflowpro
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate --seed
   ```

7. **Create storage link**
   ```bash
   php artisan storage:link
   ```

8. **Build frontend assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

9. **Start the development server**
   ```bash
   php artisan serve
   ```

Visit `http://localhost:8000` to see your application!

### Default Accounts

After running the seeders, you'll have these test accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Superadmin | super@admin.com | password | Full platform access |
| Admin | admin@example.com | password | Admin dashboard + user features |
| User | user@example.com | password | User dashboard only |

---

## ⚙️ Configuration

### Environment Variables

Key environment variables to configure:

```env
# Application
APP_NAME="TaskFlowPro"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taskflowpro
DB_USERNAME=root
DB_PASSWORD=

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=local

# Queue Configuration
QUEUE_CONNECTION=sync

# Cache Configuration
CACHE_DRIVER=file
SESSION_DRIVER=file
```

### Role and Permission Setup

The application uses Spatie Laravel-Permission for role management. Roles and permissions are automatically seeded, but you can customize them in:

- `database/seeders/RolesAndPermissionsSeeder.php`

### File Upload Configuration

Configure file uploads in `config/filesystems.php` and update the User model's avatar handling methods.

---

## 📖 Usage

### User Registration and Login

1. **Registration**: Users can register at `/register`
2. **Email Verification**: Optional email verification system
3. **Login**: Access at `/login` with automatic role-based redirection
4. **Password Reset**: Self-service password reset functionality

### Dashboard Navigation

- **Users**: Redirected to `/dashboard` (User Dashboard)
- **Admins**: Access both user dashboard and `/admin/dashboard`
- **Superadmins**: Access all dashboards including `/superadmin/dashboard`

### Project and Task Management

1. **Create Projects**: Users can create and manage projects
2. **Task Assignment**: Assign tasks to team members
3. **Status Tracking**: Track progress with status updates
4. **File Attachments**: Upload files to projects and tasks

### Content Moderation

1. **Post Creation**: Users create posts that enter moderation queue
2. **Admin Review**: Admins can approve, reject, or flag content
3. **Status Management**: Track content through approval workflow

### System Administration

**For Admins:**
- User management within workspace
- Content moderation
- Basic analytics and reporting

**For Superadmins:**
- Platform-wide user management
- System health monitoring
- Feature flag management
- Audit log review
- Performance optimization

---

## 🔌 API Documentation

The application includes API endpoints for mobile apps or third-party integrations:

### Authentication Endpoints
```
POST /api/login
POST /api/register
POST /api/logout
POST /api/refresh
```

### User Endpoints
```
GET /api/user
PUT /api/user/profile
GET /api/user/dashboard
```

### Project Endpoints
```
GET /api/projects
POST /api/projects
GET /api/projects/{id}
PUT /api/projects/{id}
DELETE /api/projects/{id}
```

### Task Endpoints
```
GET /api/tasks
POST /api/tasks
GET /api/tasks/{id}
PUT /api/tasks/{id}
DELETE /api/tasks/{id}
```

API documentation is available at `/api/documentation` when enabled.

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run with coverage
php artisan test --coverage
```

### Test Structure

```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── LoginTest.php
│   │   ├── RegistrationTest.php
│   │   └── PasswordResetTest.php
│   ├── User/
│   │   ├── DashboardTest.php
│   │   ├── ProfileTest.php
│   │   └── ProjectTest.php
│   ├── Admin/
│   │   ├── UserManagementTest.php
│   │   └── ContentModerationTest.php
│   └── Superadmin/
│       ├── SystemHealthTest.php
│       └── UserManagementTest.php
└── Unit/
    ├── Models/
    ├── Services/
    └── Helpers/
```

### Writing Tests

Example test for user dashboard:

```php
<?php

namespace Tests\Feature\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('User/Dashboard')
        );
    }
}
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set up proper mail configuration
- [ ] Configure file storage (S3, etc.)
- [ ] Set up queue workers
- [ ] Configure caching (Redis)
- [ ] Set up SSL certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging

### Docker Deployment

```dockerfile
# Dockerfile example
FROM php:8.2-fpm

# Install dependencies and configure PHP
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www/storage

EXPOSE 9000
CMD ["php-fpm"]
```

### Laravel Forge Deployment

1. Connect your repository to Laravel Forge
2. Configure environment variables
3. Set up deployment script:

```bash
cd /home/forge/your-site.com
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
npm ci
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`php artisan test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Follow PSR-12 coding standards for PHP
- Use Laravel Pint for code formatting: `./vendor/bin/pint`
- Follow React/JavaScript best practices
- Use ESLint and Prettier for frontend code

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP framework for web artisans
- [React](https://reactjs.org) - A JavaScript library for building user interfaces
- [Inertia.js](https://inertiajs.com) - The modern monolith
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Spatie](https://spatie.be) - For the excellent Laravel packages

---

## 📞 Support

- 📧 Email: support@taskflowpro.com
- 💬 Discord: [Join our community](https://discord.gg/taskflowpro)
- 📖 Documentation: [docs.taskflowpro.com](https://docs.taskflowpro.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/taskflowpro-starter/issues)

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Multi-tenancy Support** - Full workspace isolation
- [ ] **Advanced Analytics** - Detailed reporting and insights
- [ ] **API Rate Limiting** - Advanced API protection
- [ ] **Two-Factor Authentication** - Enhanced security
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Advanced File Management** - Cloud storage integration
- [ ] **Billing Integration** - Stripe/PayPal integration
- [ ] **Mobile App** - React Native companion app
- [ ] **AI Integration** - Smart suggestions and automation
- [ ] **Advanced Search** - Elasticsearch integration

### Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added avatar system and profile management
- **v1.2.0** - Enhanced superadmin features and system monitoring

---

*Built with ❤️ by the TaskFlowPro team* 