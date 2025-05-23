import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

export default function Edit({ auth, task, projects = [], project_members = [] }) {
    // Ensure arrays
    const projectList = Array.isArray(projects) ? projects : [];
    const memberList = Array.isArray(project_members) ? project_members : [];

    const { data, setData, put, processing, errors } = useForm({
        title: task.title || '',
        description: task.description || '',
        project_id: task.project_id || '',
        assigned_to: task.assigned_to || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        due_date: task.due_date || '',
        estimated_hours: task.estimated_hours || '',
        actual_hours: task.actual_hours || '',
        progress: task.progress || 0,
        notes: task.notes || '',
        tags: task.tags || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('user.tasks.update', task.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Task
                    </h2>
                    <div className="flex space-x-2">
                        <Link href={route('user.tasks.show', task.id)}>
                            <Button variant="outline">View Task</Button>
                        </Link>
                        <Link href={route('user.tasks.index')}>
                            <Button variant="outline">Back to Tasks</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Task: ${task.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Task</CardTitle>
                            <CardDescription>
                                Update the task details and track your progress.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                        placeholder="Enter task title"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        placeholder="Describe what needs to be done"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_id">Project</Label>
                                        <select
                                            id="project_id"
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        >
                                            <option value="">Select a project (optional)</option>
                                            {projectList.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.project_id && (
                                            <p className="text-sm text-red-600">{errors.project_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="assigned_to">Assigned To</Label>
                                        <select
                                            id="assigned_to"
                                            value={data.assigned_to}
                                            onChange={(e) => setData('assigned_to', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        >
                                            <option value="">Unassigned</option>
                                            {memberList.map((member) => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name} ({member.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assigned_to && (
                                            <p className="text-sm text-red-600">{errors.assigned_to}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="in_review">In Review</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <select
                                            id="priority"
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                        {errors.priority && (
                                            <p className="text-sm text-red-600">{errors.priority}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className={errors.due_date ? 'border-red-500' : ''}
                                        />
                                        {errors.due_date && (
                                            <p className="text-sm text-red-600">{errors.due_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="progress">Progress (%)</Label>
                                        <Input
                                            id="progress"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.progress}
                                            onChange={(e) => setData('progress', parseInt(e.target.value) || 0)}
                                            className={errors.progress ? 'border-red-500' : ''}
                                            placeholder="0"
                                        />
                                        {errors.progress && (
                                            <p className="text-sm text-red-600">{errors.progress}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="estimated_hours">Estimated Hours</Label>
                                        <Input
                                            id="estimated_hours"
                                            type="number"
                                            min="0"
                                            value={data.estimated_hours}
                                            onChange={(e) => setData('estimated_hours', parseInt(e.target.value) || '')}
                                            className={errors.estimated_hours ? 'border-red-500' : ''}
                                            placeholder="0"
                                        />
                                        {errors.estimated_hours && (
                                            <p className="text-sm text-red-600">{errors.estimated_hours}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="actual_hours">Actual Hours</Label>
                                        <Input
                                            id="actual_hours"
                                            type="number"
                                            min="0"
                                            value={data.actual_hours}
                                            onChange={(e) => setData('actual_hours', parseInt(e.target.value) || '')}
                                            className={errors.actual_hours ? 'border-red-500' : ''}
                                            placeholder="0"
                                        />
                                        {errors.actual_hours && (
                                            <p className="text-sm text-red-600">{errors.actual_hours}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className={errors.notes ? 'border-red-500' : ''}
                                        placeholder="Add any additional notes or comments"
                                        rows={4}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Task'}
                                    </Button>
                                    <Link href={route('user.tasks.show', task.id)}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 