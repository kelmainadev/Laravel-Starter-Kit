import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function AuditLogsIndex({ auth, auditLogs, filters }) {
    const getActionBadge = (action) => {
        if (action.includes('created')) return 'default';
        if (action.includes('updated')) return 'secondary';
        if (action.includes('deleted')) return 'destructive';
        return 'outline';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Audit Logs
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{auditLogs?.length || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Audit entries</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {auditLogs?.filter(log => {
                                                const logDate = new Date(log.created_at);
                                                const today = new Date();
                                                return logDate.toDateString() === today.toDateString();
                                            }).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Actions today</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">User Actions</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {auditLogs?.filter(log => log.action.includes('user')).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">User-related</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">System Actions</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {auditLogs?.filter(log => !log.action.includes('user')).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">System-related</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Audit Logs Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Audit Logs</CardTitle>
                                    <CardDescription>System and user activity tracking</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {auditLogs && auditLogs.length > 0 ? (
                                        <div className="space-y-4">
                                            {auditLogs.map((log, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <Badge variant={getActionBadge(log.action)}>
                                                                    {log.action}
                                                                </Badge>
                                                                <span className="text-sm font-medium">{log.user_name}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                                <span>IP: {log.ip_address}</span>
                                                                <span>{formatDate(log.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('superadmin.audit-logs.show', log.id)}>
                                                            <Button variant="outline" size="sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Audit logging is active and will capture future activities.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Management Actions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Log Management</CardTitle>
                                    <CardDescription>Manage audit log retention and cleanup</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button variant="outline" className="w-full">
                                            Export Logs
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Filter Logs
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Search Logs
                                        </Button>
                                        <Button variant="destructive" className="w-full">
                                            Clear Old Logs
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