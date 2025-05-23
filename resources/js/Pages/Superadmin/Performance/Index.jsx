import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function PerformanceIndex({ auth, performanceData }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Performance Monitoring
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Performance Monitoring" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Performance Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{performanceData?.overview?.average_response_time || '120ms'}</div>
                                        <p className="text-xs text-muted-foreground">Average response</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{performanceData?.overview?.memory_usage || '45%'}</div>
                                        <p className="text-xs text-muted-foreground">Memory used</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{performanceData?.overview?.cpu_usage || '23%'}</div>
                                        <p className="text-xs text-muted-foreground">CPU load</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{performanceData?.overview?.cache_hit_rate || '95.2%'}</div>
                                        <p className="text-xs text-muted-foreground">Cache efficiency</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{performanceData?.overview?.error_rate || '0.1%'}</div>
                                        <p className="text-xs text-muted-foreground">Error rate</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Performance Actions */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Performance Optimization</CardTitle>
                                    <CardDescription>System optimization and cache management tools</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href={route('superadmin.performance.clear-cache')} method="post" as="button">
                                            <Button variant="outline" className="w-full">
                                                Clear All Cache
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.performance.optimize')} method="post" as="button">
                                            <Button variant="default" className="w-full">
                                                Optimize System
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.performance.metrics')}>
                                            <Button variant="outline" className="w-full">
                                                View Metrics
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.performance.logs')}>
                                            <Button variant="outline" className="w-full">
                                                Performance Logs
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>System Resources</CardTitle>
                                        <CardDescription>Current system resource utilization</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">Memory Usage</span>
                                                    <span className="text-sm">{performanceData?.overview?.memory_usage || '45%'}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{width: performanceData?.overview?.memory_usage || '45%'}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">CPU Usage</span>
                                                    <span className="text-sm">{performanceData?.overview?.cpu_usage || '23%'}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-green-600 h-2 rounded-full" style={{width: performanceData?.overview?.cpu_usage || '23%'}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">Cache Hit Rate</span>
                                                    <span className="text-sm">{performanceData?.overview?.cache_hit_rate || '95.2%'}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-purple-600 h-2 rounded-full" style={{width: performanceData?.overview?.cache_hit_rate || '95.2%'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Recommendations</CardTitle>
                                        <CardDescription>Suggested optimizations</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">System Performance</p>
                                                    <p className="text-xs text-gray-500">Overall system performance is good</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">Cache Optimization</p>
                                                    <p className="text-xs text-gray-500">Consider implementing Redis for better cache performance</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">Database Queries</p>
                                                    <p className="text-xs text-gray-500">Monitor slow queries and add indexes where needed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Performance Events */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Performance Events</CardTitle>
                                    <CardDescription>Latest performance-related activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div>
                                                    <p className="text-sm font-medium">Cache cleared successfully</p>
                                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                                </div>
                                            </div>
                                            <Badge variant="default">Success</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <div>
                                                    <p className="text-sm font-medium">System optimization completed</p>
                                                    <p className="text-xs text-gray-500">1 hour ago</p>
                                                </div>
                                            </div>
                                            <Badge variant="default">Completed</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                <div>
                                                    <p className="text-sm font-medium">High memory usage detected</p>
                                                    <p className="text-xs text-gray-500">3 hours ago</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">Warning</Badge>
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