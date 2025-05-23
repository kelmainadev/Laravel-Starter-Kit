import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function SuperadminDashboard({ auth, message, stats, recentActivities, systemHealth }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Superadmin Dashboard
                    </h2>
                    <Badge variant="destructive">
                        {auth.user?.roles?.[0]?.name?.toUpperCase() || 'SUPERADMIN'}
                    </Badge>
                </div>
            }
        >
            <Head title="Superadmin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Welcome Card */}
                                <Card className="col-span-full border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-red-600">Platform Control Center</CardTitle>
                                        <CardDescription>
                                            {message || "Superadmin dashboard - complete platform control with unrestricted access to all systems."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Supreme Administrator: {auth.user.name}</p>
                                                <p className="text-sm text-gray-600">Platform Access: Unlimited</p>
                                                <p className="text-sm text-gray-600">Security Level: Maximum</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System Stats */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.workspaces || '1'}</div>
                                        <p className="text-xs text-muted-foreground">Active workspaces</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.users?.total || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Total registered users</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">{stats?.system?.uptime || '99.9%'}</div>
                                        <p className="text-xs text-muted-foreground">Uptime status</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${stats?.revenue?.monthly || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Superadmin Actions */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Platform Control Actions</CardTitle>
                                    <CardDescription>System-wide management and monitoring tools</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href={route('superadmin.workspaces.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="text-sm">Manage Workspaces</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.system-health.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <span className="text-sm">System Health</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.billing.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                <span className="text-sm">Billing Overview</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.audit-logs.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span className="text-sm">Audit Logs</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.users.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <span className="text-sm">All Users</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.settings.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm">Platform Settings</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.feature-flags.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 8v8m6-8v8" />
                                                </svg>
                                                <span className="text-sm">Feature Flags</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('superadmin.performance.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span className="text-sm">Performance</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Superadmin Capabilities and System Monitoring */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Superadmin Capabilities</CardTitle>
                                        <CardDescription>Complete platform control and oversight</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Manage all workspaces and admins</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Approve or ban accounts platform-wide</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Monitor system performance and health</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Control platform-wide settings</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Access audit logs and user activities</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm">Manage subscriptions and billing</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>System Monitoring</CardTitle>
                                        <CardDescription>Real-time platform status and alerts</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {systemHealth && Object.entries(systemHealth).map(([key, health]) => (
                                                <div key={key} className="flex items-center space-x-4">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        health.status === 'healthy' ? 'bg-green-500' : 
                                                        health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium capitalize">{key}: {health.status}</p>
                                                        <p className="text-xs text-gray-500">{health.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activities */}
                            {recentActivities && recentActivities.length > 0 && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle>Recent Platform Activities</CardTitle>
                                        <CardDescription>Latest actions across the platform</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentActivities.slice(0, 5).map((activity, index) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{activity.description}</p>
                                                        <p className="text-xs text-gray-500">
                                                            by {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
 