import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

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
                            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                            <CardDescription>
                                Welcome back! Please enter your details to continue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
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
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
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
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (
                                        <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            id="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full"
                                    size="lg"
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link href={route('register')}>
                                        <Button variant="outline" className="w-full" size="lg">
                                            Create account
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
                </div>
            </div>
        </>
    );
}
