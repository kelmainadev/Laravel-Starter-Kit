import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function Index({ auth, projects = [], pagination, filters, stats }) {
    // Ensure projects is always an array
    const projectList = Array.isArray(projects) ? projects : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Projects
                    </h2>
                    <Link href={route('user.projects.create')}>
                        <Button>Create New Project</Button>
                    </Link>
                </div>
            }
        >
            <Head title="My Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {projectList.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                                    <div className="mt-6">
                                        <Link href={route('user.projects.create')}>
                                            <Button>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                New Project
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projectList.map((project) => (
                                        <Card key={project.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                        {project.status}
                                                    </Badge>
                                                </div>
                                                <CardDescription>
                                                    {project.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Tasks: {project.tasks_count || 0}</span>
                                                        <span>Members: {project.members_count || 1}</span>
                                                    </div>
                                                    
                                                    <div className="flex space-x-2">
                                                        <Link href={route('user.projects.show', project.id)}>
                                                            <Button variant="outline" size="sm">View</Button>
                                                        </Link>
                                                        <Link href={route('user.projects.edit', project.id)}>
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Info */}
                            {pagination && projectList.length > 0 && (
                                <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                                    <span>
                                        Showing {projectList.length} of {pagination.total} projects
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