import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function Appearance() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Appearance Settings
                    </h2>
                    <Link href={route('profile.edit')}>
                        <Button variant="outline">Back to Profile</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Appearance Settings" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>
                                Customize how the application looks and feels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Appearance Settings</h3>
                                    <p className="mt-1 text-sm text-gray-500">Theme preferences and UI customization options will be available here.</p>
                                    
                                    <div className="mt-6">
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h4 className="font-medium text-gray-900 mb-2">Coming Soon</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li>• Dark/Light theme toggle</li>
                                                <li>• Color scheme customization</li>
                                                <li>• Font size preferences</li>
                                                <li>• Layout options</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 