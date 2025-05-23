import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">TaskFlowPro</h1>
                        <Badge variant="secondary" className="mt-2">Starter Kit</Badge>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Create your account</CardTitle>
                            <CardDescription>
                                Join TaskFlowPro and start managing your workflow today.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block w-full"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-sm text-red-600">{errors.name}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {errors.email && (
                                        <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Choose a strong password"
                                        required
                                    />
                                    {errors.password && (
                                        <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <div className="mt-1 text-sm text-red-600">{errors.password_confirmation}</div>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full"
                                    size="lg"
                                >
                                    {processing ? 'Creating account...' : 'Create account'}
                                </Button>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link href={route('login')}>
                                        <Button variant="outline" className="w-full" size="lg">
                                            Sign in instead
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <Link href={route('home')} className="text-sm text-gray-600 hover:text-gray-500">
                            ← Back to home
                        </Link>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </div>
            </div>
        </>
    );
}
