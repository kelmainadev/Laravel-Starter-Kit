import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

export default function Profile({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Profile Settings
                    </h2>
                    <Link href={route('user.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Profile Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account's profile information and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                            <p className="text-sm text-yellow-800">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="underline text-yellow-900 hover:no-underline"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>
                                            {processing ? 'Saving...' : 'Save'}
                                        </Button>

                                        {recentlySuccessful && (
                                            <p className="text-sm text-green-600">Saved successfully!</p>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Account Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Management</CardTitle>
                                <CardDescription>
                                    Manage your account settings and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium">Password</h4>
                                            <p className="text-sm text-gray-600">Change your account password</p>
                                        </div>
                                        <Link href={route('password.edit')}>
                                            <Button variant="outline">Change Password</Button>
                                        </Link>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium text-red-600">Delete Account</h4>
                                                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                                            </div>
                                            <Button 
                                                variant="destructive"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                        // Handle account deletion
                                                        alert('Account deletion feature will be implemented');
                                                    }
                                                }}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 