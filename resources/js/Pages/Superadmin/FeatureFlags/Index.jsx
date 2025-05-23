import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function FeatureFlagsIndex({ auth, featureFlags }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Feature Flags
                    </h2>
                    <div className="flex space-x-2">
                        <Button>Create Feature Flag</Button>
                        <Link href={route('superadmin.dashboard')}>
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Feature Flags" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 8v8m6-8v8" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{featureFlags?.length || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Feature flags</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Enabled</CardTitle>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {featureFlags?.filter(flag => flag.enabled).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Active flags</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Disabled</CardTitle>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {featureFlags?.filter(flag => !flag.enabled).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Inactive flags</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Partial Rollout</CardTitle>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {featureFlags?.filter(flag => flag.enabled && flag.rollout_percentage < 100).length || '0'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Gradual rollout</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Feature Flags List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Feature Flags Management</CardTitle>
                                    <CardDescription>Control feature rollouts and A/B testing</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {featureFlags && featureFlags.length > 0 ? (
                                        <div className="space-y-4">
                                            {featureFlags.map((flag, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-3 h-3 rounded-full ${flag.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h3 className="font-medium">{flag.name}</h3>
                                                                <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                                                                    {flag.enabled ? 'Enabled' : 'Disabled'}
                                                                </Badge>
                                                                {flag.enabled && flag.rollout_percentage < 100 && (
                                                                    <Badge variant="outline">
                                                                        {flag.rollout_percentage}% rollout
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                                <span>Created: {formatDate(flag.created_at)}</span>
                                                                <span>Updated: {formatDate(flag.updated_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                        <Link href={route('superadmin.feature-flags.toggle', flag.id)} method="put" as="button">
                                                            <Button variant={flag.enabled ? 'destructive' : 'default'} size="sm">
                                                                {flag.enabled ? 'Disable' : 'Enable'}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 8v8m6-8v8" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No feature flags</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Get started by creating your first feature flag.
                                            </p>
                                            <div className="mt-6">
                                                <Button>Create Feature Flag</Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Management Actions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Feature Flag Management</CardTitle>
                                    <CardDescription>Bulk operations and advanced controls</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button variant="outline" className="w-full">
                                            Bulk Enable
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Bulk Disable
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Export Configuration
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Import Configuration
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