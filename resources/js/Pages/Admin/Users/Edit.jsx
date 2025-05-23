import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, user, roles, userRole }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: userRole || 'user',
        status: user.status || 'active',
    });

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'inactive', label: 'Inactive' },
    ];

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Edit User</h2>
                    <Link
                        href={route('admin.users.index')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Back to Users
                    </Link>
                </div>
            }
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="block w-full mt-1"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="block w-full mt-1"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="password" value="Password (leave blank to keep unchanged)" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="block w-full mt-1"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="block w-full mt-1"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role"
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        required
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.name}>
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        required
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update User
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 