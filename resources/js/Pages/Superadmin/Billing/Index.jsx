import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function BillingIndex({ auth, billingData }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Billing Overview
                    </h2>
                    <Link href={route('superadmin.dashboard')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Billing Overview" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Revenue Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${billingData?.overview?.total_revenue || '0'}</div>
                                        <p className="text-xs text-muted-foreground">All time revenue</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${billingData?.overview?.monthly_revenue || '0'}</div>
                                        <p className="text-xs text-muted-foreground">This month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{billingData?.overview?.active_subscriptions || '0'}</div>
                                        <p className="text-xs text-muted-foreground">Paying customers</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{billingData?.overview?.churn_rate || '0%'}</div>
                                        <p className="text-xs text-muted-foreground">Monthly churn</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Subscription Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Subscription Plans</CardTitle>
                                        <CardDescription>Active subscriptions by plan type</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Basic Plan</span>
                                                <Badge variant="secondary">{billingData?.subscription_stats?.basic || '0'} users</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Premium Plan</span>
                                                <Badge variant="default">{billingData?.subscription_stats?.premium || '0'} users</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Enterprise Plan</span>
                                                <Badge variant="destructive">{billingData?.subscription_stats?.enterprise || '0'} users</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Revenue Metrics</CardTitle>
                                        <CardDescription>Key financial indicators</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Annual Revenue</span>
                                                <span className="text-sm font-bold">${billingData?.overview?.annual_revenue || '0'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Trial Users</span>
                                                <span className="text-sm">{billingData?.overview?.trial_users || '0'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Conversion Rate</span>
                                                <span className="text-sm">N/A</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Average Revenue Per User</span>
                                                <span className="text-sm">$0</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Transactions */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>Latest payment activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {billingData?.recent_transactions && billingData.recent_transactions.length > 0 ? (
                                        <div className="space-y-4">
                                            {billingData.recent_transactions.map((transaction, index) => (
                                                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{transaction.description}</p>
                                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">${transaction.amount}</p>
                                                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                                                            {transaction.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No transactions yet</p>
                                            <p className="text-sm text-gray-400">Billing integration is ready for setup</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Billing Management</CardTitle>
                                    <CardDescription>Manage billing and subscription settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href={route('superadmin.billing.subscriptions')}>
                                            <Button variant="outline" className="w-full">
                                                View Subscriptions
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.billing.transactions')}>
                                            <Button variant="outline" className="w-full">
                                                All Transactions
                                            </Button>
                                        </Link>
                                        <Link href={route('superadmin.billing.revenue')}>
                                            <Button variant="outline" className="w-full">
                                                Revenue Reports
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full" disabled>
                                            Export Data
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