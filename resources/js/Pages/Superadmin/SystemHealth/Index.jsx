import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function SystemHealthIndex({ auth, healthData }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'healthy': return 'default';
            case 'warning': return 'secondary';
            case 'error': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        System Health Monitoring
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="System Health" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Database</CardTitle>
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(healthData?.database?.status || 'healthy')}`}></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <Badge variant={getStatusBadge(healthData?.database?.status || 'healthy')}>
                                                {healthData?.database?.status || 'Healthy'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Response: {healthData?.database?.response_time || '5ms'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Cache</CardTitle>
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(healthData?.cache?.status || 'healthy')}`}></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <Badge variant={getStatusBadge(healthData?.cache?.status || 'healthy')}>
                                                {healthData?.cache?.status || 'Healthy'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Hit Rate: {healthData?.cache?.hit_rate || '95.2%'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Storage</CardTitle>
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(healthData?.storage?.status || 'healthy')}`}></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <Badge variant={getStatusBadge(healthData?.storage?.status || 'healthy')}>
                                                {healthData?.storage?.status || 'Healthy'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Usage: {healthData?.storage?.usage_percent || '45%'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Queues</CardTitle>
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(healthData?.queues?.status || 'healthy')}`}></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <Badge variant={getStatusBadge(healthData?.queues?.status || 'healthy')}>
                                                {healthData?.queues?.status || 'Healthy'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Pending: {healthData?.queues?.pending_jobs || '0'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Health Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Metrics</CardTitle>
                                        <CardDescription>System performance indicators</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Average Response Time</span>
                                                <span className="text-sm">{healthData?.performance?.average_response_time || '120ms'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Memory Usage</span>
                                                <span className="text-sm">{healthData?.performance?.memory_usage || '45%'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">CPU Usage</span>
                                                <span className="text-sm">{healthData?.performance?.cpu_usage || '23%'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Error Rate</span>
                                                <span className="text-sm">{healthData?.performance?.error_rate || '0.1%'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>System Overview</CardTitle>
                                        <CardDescription>General system status</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">System Status</span>
                                                <Badge variant={getStatusBadge(healthData?.overview?.status || 'healthy')}>
                                                    {healthData?.overview?.status || 'Operational'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Uptime</span>
                                                <span className="text-sm">{healthData?.overview?.uptime || '99.9%'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Issues</span>
                                                <span className="text-sm">{healthData?.overview?.issues || '0'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Warnings</span>
                                                <span className="text-sm">{healthData?.overview?.warnings || '1'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>System Actions</CardTitle>
                                    <CardDescription>Quick system management actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href={route('superadmin.system-health.database')}>
                                            <Button variant="outline" className="w-full">
                                                Database Details
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.system-health.storage')}>
                                            <Button variant="outline" className="w-full">
                                                Storage Details
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.system-health.queues')}>
                                            <Button variant="outline" className="w-full">
                                                Queue Status
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.system-health.performance')}>
                                            <Button variant="outline" className="w-full">
                                                Performance
                                            </Button>
                                        </Link>
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