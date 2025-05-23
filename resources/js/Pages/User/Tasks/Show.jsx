import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function Show({ auth, task }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'todo':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_review':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('user.tasks.destroy', task.id));
        }
    };

    const handleMarkCompleted = () => {
        if (confirm('Mark this task as completed?')) {
            router.patch(route('user.tasks.complete', task.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Task Details
                    </h2>
                    <div className="flex space-x-2">
                        <Link href={route('user.tasks.index')}>
                            <Button variant="outline">Back to Tasks</Button>
                        </Link>
                        {task.can_edit && (
                            <Link href={route('user.tasks.edit', task.id)}>
                                <Button>Edit Task</Button>
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Task: ${task.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                        {task.description || 'No description provided'}
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Badge className={getStatusColor(task.status)}>
                                        {task.status?.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    <Badge className={getPriorityColor(task.priority)}>
                                        {task.priority?.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Task Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Project</h4>
                                            <p className="text-gray-600">
                                                {task.project ? (
                                                    <Link 
                                                        href={route('user.projects.show', task.project.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {task.project.name}
                                                    </Link>
                                                ) : (
                                                    'No project assigned'
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Assigned To</h4>
                                            <p className="text-gray-600">
                                                {task.assigned_user ? task.assigned_user.name : 'Unassigned'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Created By</h4>
                                            <p className="text-gray-600">
                                                {task.creator ? task.creator.name : 'Unknown'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Due Date</h4>
                                            <p className={`${task.is_overdue ? 'text-red-600' : task.is_due_soon ? 'text-orange-600' : 'text-gray-600'}`}>
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                                {task.is_overdue && <span className="ml-2 text-sm">(Overdue)</span>}
                                                {task.is_due_soon && !task.is_overdue && <span className="ml-2 text-sm">(Due Soon)</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Progress</h4>
                                            <div className="mt-2">
                                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                    <span>Progress</span>
                                                    <span>{task.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Estimated Hours</h4>
                                            <p className="text-gray-600">
                                                {task.estimated_hours ? `${task.estimated_hours} hours` : 'Not estimated'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Actual Hours</h4>
                                            <p className="text-gray-600">
                                                {task.actual_hours ? `${task.actual_hours} hours` : 'No time logged'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">Created</h4>
                                            <p className="text-gray-600">{task.created_at}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {task.tags && task.tags.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {task.notes && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-gray-700 whitespace-pre-wrap">{task.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4 border-t">
                                    {task.can_edit && task.status !== 'completed' && (
                                        <Button onClick={handleMarkCompleted} variant="outline">
                                            Mark as Completed
                                        </Button>
                                    )}
                                    
                                    {task.can_edit && (
                                        <>
                                            <Link href={route('user.tasks.edit', task.id)}>
                                                <Button variant="outline">Edit Task</Button>
                                            </Link>
                                            
                                            <Button 
                                                onClick={handleDelete} 
                                                variant="destructive"
                                            >
                                                Delete Task
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 