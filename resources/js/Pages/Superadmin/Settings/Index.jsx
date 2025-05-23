import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function SettingsIndex({ auth, settings }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Platform Settings
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Platform Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* General Settings */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>General Settings</CardTitle>
                                    <CardDescription>Basic platform configuration</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Application Name
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.general?.app_name || 'TaskFlowPro'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Application URL
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.general?.app_url || 'http://localhost'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Timezone
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.general?.timezone || 'UTC'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maintenance Mode
                                            </label>
                                            <Badge variant={settings?.general?.maintenance_mode ? 'destructive' : 'default'}>
                                                {settings?.general?.maintenance_mode ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature Settings */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Feature Settings</CardTitle>
                                    <CardDescription>Enable or disable platform features</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">User Registration</span>
                                            <Badge variant={settings?.features?.user_registration ? 'default' : 'secondary'}>
                                                {settings?.features?.user_registration ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Email Notifications</span>
                                            <Badge variant={settings?.features?.email_notifications ? 'default' : 'secondary'}>
                                                {settings?.features?.email_notifications ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">File Uploads</span>
                                            <Badge variant={settings?.features?.file_uploads ? 'default' : 'secondary'}>
                                                {settings?.features?.file_uploads ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">API Access</span>
                                            <Badge variant={settings?.features?.api_access ? 'default' : 'secondary'}>
                                                {settings?.features?.api_access ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Limits */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>System Limits</CardTitle>
                                    <CardDescription>Platform usage limits and restrictions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Users per Workspace
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.limits?.max_users_per_workspace || '100'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Projects per User
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.limits?.max_projects_per_user || '50'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max File Size (MB)
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.limits?.max_file_size_mb || '10'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                API Rate Limit
                                            </label>
                                            <p className="text-sm text-gray-900">{settings?.limits?.api_rate_limit || '1000'} requests/hour</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings Management</CardTitle>
                                    <CardDescription>Manage different aspects of platform settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <Button variant="outline" className="w-full">
                                            Edit General Settings
                                        </Button>
                                        <Link href={route('superadmin.settings.security')}>
                                            <Button variant="outline" className="w-full">
                                                Security Settings
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.settings.email')}>
                                            <Button variant="outline" className="w-full">
                                                Email Settings
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full">
                                            Backup Settings
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Integration Settings
                                        </Button>
                                        <Button variant="destructive" className="w-full">
                                            Reset to Defaults
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