import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function Index({ auth, tasks = [], projects = [], pagination, filters, stats }) {
    // Ensure tasks and projects are always arrays
    const taskList = Array.isArray(tasks) ? tasks : [];
    const projectList = Array.isArray(projects) ? projects : [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-orange-100 text-orange-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Tasks
                    </h2>
                    <Link href={route('user.tasks.create')}>
                        <Button>Create New Task</Button>
                    </Link>
                </div>
            }
        >
            <Head title="My Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {taskList.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                                    <div className="mt-6">
                                        <Link href={route('user.tasks.create')}>
                                            <Button>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                New Task
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {taskList.map((task) => (
                                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg">{task.title}</CardTitle>
                                                        <CardDescription className="mt-1">
                                                            {task.description}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Badge className={getStatusColor(task.status)}>
                                                            {task.status?.replace('_', ' ')}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(task.priority)}>
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Project: {task.project?.name || 'No Project'}</span>
                                                        <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                                                    </div>
                                                    
                                                    {task.progress !== undefined && (
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm">
                                                                <span>Progress</span>
                                                                <span>{task.progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                                    style={{ width: `${task.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex space-x-2">
                                                        <Link href={route('user.tasks.show', task.id)}>
                                                            <Button variant="outline" size="sm">View</Button>
                                                        </Link>
                                                        <Link href={route('user.tasks.edit', task.id)}>
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        </Link>
                                                        {task.status !== 'completed' && (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => {
                                                                    // Handle complete task
                                                                    if (confirm('Mark this task as completed?')) {
                                                                        // Add complete functionality
                                                                    }
                                                                }}
                                                            >
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Info */}
                            {pagination && taskList.length > 0 && (
                                <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                                    <span>
                                        Showing {taskList.length} of {pagination.total} tasks
                                    </span>
                                    {pagination.has_more_pages && (
                                        <span>
                                            Page {pagination.current_page} of {pagination.last_page}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 