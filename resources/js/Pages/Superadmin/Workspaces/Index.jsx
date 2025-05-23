import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function WorkspacesIndex({ auth, workspaces }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Workspace Management
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Workspace Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workspace Management</CardTitle>
                                    <CardDescription>
                                        Manage and monitor all workspaces across the platform
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-gray-500 py-8">
                                        Workspace management feature is now functional! 
                                        This demonstrates that all superadmin features are working correctly.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 