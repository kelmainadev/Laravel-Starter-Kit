import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import NotificationCenter from '../Components/NotificationCenter';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const getUserRole = () => {
        if (auth?.user?.roles && auth.user.roles.length > 0 && auth.user.roles[0]?.name) {
            return auth.user.roles[0].name;
        }
        return 'user';
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'superadmin':
                return 'destructive';
            case 'admin':
                return 'default';
            case 'user':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getNavigationLinks = () => {
        const role = getUserRole();
        const links = [];

        // User links
        links.push({ name: 'Dashboard', href: route('user.dashboard') });
        links.push({ name: 'Projects', href: route('user.projects.index') });
        links.push({ name: 'Tasks', href: route('user.tasks.index') });

        // Admin links
        if (role === 'admin' || role === 'superadmin') {
            links.push({ name: 'Admin Panel', href: route('admin.dashboard') });
        }

        // Superadmin links
        if (role === 'superadmin') {
            links.push({ name: 'Super Admin', href: route('superadmin.dashboard') });
        }

        return links;
    };

    const userRole = getUserRole();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1 className="text-xl font-bold text-gray-800">TaskFlowPro</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {getNavigationLinks().map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="flex items-center space-x-4">
                                <NotificationCenter user={auth?.user} />
                                
                                {/* User Avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {auth?.user?.avatar ? (
                                        <img 
                                            src={auth.user.avatar_url || auth.user.avatar} 
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'User')}&background=3B82F6&color=ffffff&size=200&font-size=0.6`}
                                            alt={auth?.user?.name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                
                                <Badge variant={getRoleColor(userRole)}>
                                    {userRole ? userRole.toUpperCase() : 'USER'}
                                </Badge>
                                <span className="text-sm text-gray-700">{auth?.user?.name || 'User'}</span>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {getNavigationLinks().map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="flex items-center space-x-3">
                                {/* User Avatar */}
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {auth?.user?.avatar ? (
                                        <img 
                                            src={auth.user.avatar_url || auth.user.avatar} 
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'User')}&background=3B82F6&color=ffffff&size=200&font-size=0.6`}
                                            alt={auth?.user?.name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-base text-gray-800">{auth?.user?.name || 'User'}</div>
                                    <div className="font-medium text-sm text-gray-500">{auth?.user?.email || ''}</div>
                                    <Badge variant={getRoleColor(userRole)} className="mt-2">
                                        {userRole ? userRole.toUpperCase() : 'USER'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out w-full text-left"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
