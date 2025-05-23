import { Head, Link } from '@inertiajs/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to TaskFlowPro" />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">TaskFlowPro</h1>
                                <Badge variant="secondary" className="ml-3">Starter Kit</Badge>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">Welcome, {auth.user.name}</span>
                                        <Link href={route('user.dashboard')}>
                                            <Button>Go to Dashboard</Button>
                                    </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link href={route('login')}>
                                            <Button variant="outline">Log in</Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button>Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                        </header>

                {/* Hero Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                            TaskFlowPro
                            <span className="block text-blue-600">Starter Kit</span>
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            A scalable, production-ready Laravel starter application with full user authentication, 
                            admin dashboards, and superadmin controls — ideal for SaaS, internal tools, client dashboards, or marketplaces.
                        </p>
                        
                        {!auth.user && (
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link href={route('register')}>
                                    <Button size="lg" className="px-8 py-3">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button variant="outline" size="lg" className="px-8 py-3">
                                        Sign In
                                    </Button>
                                </Link>
                                            </div>
                        )}
                                            </div>
                </section>

                {/* Features */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-900">Key Features</h3>
                            <p className="mt-4 text-lg text-gray-600">Everything you need to build your next application</p>
                                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <CardTitle>Role-Based Access Control</CardTitle>
                                    <CardDescription>
                                        Multi-level access with User, Admin, and Superadmin roles using Spatie Laravel-Permission
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <CardTitle>Authentication & Security</CardTitle>
                                    <CardDescription>
                                        Complete authentication system with 2FA, email verification, and security best practices
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <CardTitle>Separate Dashboards</CardTitle>
                                    <CardDescription>
                                        Dedicated dashboards for each user role with appropriate permissions and functionality
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <CardTitle>Modern React Frontend</CardTitle>
                                    <CardDescription>
                                        Built with React, Inertia.js, and Tailwind CSS for a modern, responsive user experience
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <CardTitle>Production Ready</CardTitle>
                                    <CardDescription>
                                        Deployment-friendly with Docker, comprehensive testing, and scalable architecture
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <CardTitle>Extensible Modules</CardTitle>
                                    <CardDescription>
                                        Easy to extend with additional features like billing, file uploads, notifications, and more
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* User Roles Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-900">User Roles & Permissions</h3>
                            <p className="mt-4 text-lg text-gray-600">Three levels of access control for different user types</p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <Card className="border-blue-200">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <Badge variant="secondary" className="mr-3">👤</Badge>
                                        <CardTitle className="text-blue-600">Users</CardTitle>
                                    </div>
                                    <CardDescription>Regular users who interact with core functionality</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Personal dashboard access</li>
                                        <li>• Profile management</li>
                                        <li>• Create and manage own data</li>
                                        <li>• Data export capabilities</li>
                                        <li>• Notifications and alerts</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-green-200">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <Badge variant="default" className="mr-3">🛠️</Badge>
                                        <CardTitle className="text-green-600">Admins</CardTitle>
                                    </div>
                                    <CardDescription>Team leads and managers with workspace control</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• All user permissions</li>
                                        <li>• Admin dashboard access</li>
                                        <li>• User management within team</li>
                                        <li>• Content moderation</li>
                                        <li>• Workspace analytics</li>
                                        <li>• Team settings configuration</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-red-200">
                                <CardHeader>
                                    <div className="flex items-center">
                                        <Badge variant="destructive" className="mr-3">👑</Badge>
                                        <CardTitle className="text-red-600">Superadmins</CardTitle>
                                    </div>
                                    <CardDescription>Platform administrators with unrestricted access</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• All admin permissions</li>
                                        <li>• Superadmin dashboard</li>
                                        <li>• Manage all workspaces</li>
                                        <li>• System health monitoring</li>
                                        <li>• Platform-wide settings</li>
                                        <li>• Audit logs and activities</li>
                                    </ul>
                                </CardContent>
                            </Card>
                                </div>
                            </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h4 className="text-xl font-bold">TaskFlowPro Starter Kit</h4>
                        <p className="mt-2 text-gray-400">
                            Built with Laravel, React, and modern best practices
                        </p>
                        <div className="mt-8 flex justify-center space-x-6">
                            <Badge variant="outline" className="text-gray-300 border-gray-600">Laravel 11</Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">React 18</Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">Tailwind CSS</Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">Inertia.js</Badge>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
