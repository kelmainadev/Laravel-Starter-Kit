import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function UsersIndex({ auth, users, stats, filters, roles }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'default';
            case 'suspended': return 'destructive';
            case 'inactive': return 'secondary';
            default: return 'outline';
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin': return 'destructive';
            case 'admin': return 'default';
            case 'user': return 'secondary';
            default: return 'outline';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        All Users Management
                    </h2>
                    <div className="flex space-x-2">
                        <Link href={route('superadmin.users.create')}>
                            <Button>Create User</Button>
                        </Link>
                        <Link href={route('superadmin.dashboard')}>
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="All Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* User Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.total || '0'}</div>
                                        <p className="text-xs text-muted-foreground">All users</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.active || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Active users</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.suspended || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Suspended</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Superadmins</CardTitle>
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.superadmins || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Superadmins</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.admins || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Admins</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.users || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Regular users</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Users Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Platform Users</CardTitle>
                                    <CardDescription>Manage all users across the platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {users && users.data && users.data.length > 0 ? (
                                        <div className="space-y-4">
                                            {users.data.map((user, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            {user.avatar ? (
                                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                                            ) : (
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h3 className="font-medium">{user.name}</h3>
                                                                <Badge variant={getStatusBadge(user.status)}>
                                                                    {user.status}
                                                                </Badge>
                                                                {user.roles && user.roles.length > 0 && (
                                                                    <Badge variant={getRoleBadge(user.roles[0].name)}>
                                                                        {user.roles[0].name}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600">{user.email}</p>
                                                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                                <span>Joined: {formatDate(user.created_at)}</span>
                                                                {user.email_verified_at && (
                                                                    <span className="text-green-600">✓ Verified</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('superadmin.users.show', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('superadmin.users.edit', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {user.status === 'active' ? (
                                                            <Link href={route('superadmin.users.ban', user.id)} method="put" as="button">
                                                                <Button variant="destructive" size="sm">
                                                                    Ban
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Link href={route('superadmin.users.unban', user.id)} method="put" as="button">
                                                                <Button variant="default" size="sm">
                                                                    Unban
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Get started by creating a new user.
                                            </p>
                                            <div className="mt-6">
                                                <Link href={route('superadmin.users.create')}>
                                                    <Button>Create User</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {users && users.links && (
                                        <div className="mt-6 flex justify-center">
                                            <div className="flex space-x-2">
                                                {users.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-3 py-2 text-sm rounded-md ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>User Management Actions</CardTitle>
                                    <CardDescription>Bulk operations and user management tools</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button variant="outline" className="w-full">
                                            Export Users
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Bulk Actions
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Send Notifications
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            User Reports
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 