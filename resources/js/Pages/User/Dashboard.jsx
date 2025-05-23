import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function Dashboard({ auth, message, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        User Dashboard
                    </h2>
                    <Badge variant="secondary">
                        {auth.user?.roles?.[0]?.name?.toUpperCase() || 'USER'}
                    </Badge>
                </div>
            }
        >
            <Head title="User Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* Welcome Card */}
                                <Card className="col-span-full">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Welcome back, {auth.user.name}!</CardTitle>
                                        <CardDescription>{message}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {auth.user.avatar ? (
                                                    <img 
                                                        src={auth.user.avatar_url || auth.user.avatar} 
                                                        alt={auth.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=3B82F6&color=ffffff&size=200&font-size=0.6`}
                                                        alt={auth.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">User ID: {auth.user.id}</p>
                                                <p className="text-sm text-gray-600">Email: {auth.user.email}</p>
                                                <p className="text-sm text-gray-600">
                                                    Member since: {new Date(auth.user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Tasks Created</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.tasks?.created_by_me || 0}</div>
                                        <p className="text-xs text-muted-foreground">Total tasks you've created</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Posts Created</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats?.posts?.total || 0}</div>
                                        <p className="text-xs text-muted-foreground">Total posts you've created</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {stats?.profile_completion || '0'}%
                                        </div>
                                        <p className="text-xs text-muted-foreground">Profile completion rate</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common tasks and actions you can perform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href={route('user.tasks.create')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span className="text-sm">Create Task</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('user.posts.create')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span className="text-sm">New Post</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('profile.edit')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-sm">Edit Profile</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('user.tasks.index')}>
                                            <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <span className="text-sm">View Tasks</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your latest actions and updates</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Account created successfully</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(auth.user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Email verification completed</p>
                                                <p className="text-xs text-gray-500">
                                                    {auth.user.email_verified_at ? 
                                                        new Date(auth.user.email_verified_at).toLocaleDateString() : 
                                                        'Pending verification'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Profile setup in progress</p>
                                                <p className="text-xs text-gray-500">Complete your profile for better experience</p>
                                            </div>
                                        </div>
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