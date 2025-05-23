import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export default function Profile({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const avatarInputRef = useRef(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        bio: auth.user.bio || '',
        phone: auth.user.phone || '',
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true, // This ensures file uploads work
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
        }
    };

    const triggerAvatarUpload = () => {
        avatarInputRef.current?.click();
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
                                    {/* Avatar Section */}
                                    <div className="space-y-2">
                                        <Label>Profile Picture</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
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
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={triggerAvatarUpload}
                                                >
                                                    Change Avatar
                                                </Button>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    JPG, PNG or GIF. Max size 2MB.
                                                </p>
                                            </div>
                                            <input
                                                ref={avatarInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </div>
                                        {errors.avatar && (
                                            <p className="text-sm text-red-600">{errors.avatar}</p>
                                        )}
                                    </div>

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

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            autoComplete="tel"
                                            placeholder="Phone number"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            className="mt-1 block w-full"
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            placeholder="Tell us about yourself"
                                            rows={4}
                                        />
                                        {errors.bio && (
                                            <p className="text-sm text-red-600">{errors.bio}</p>
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