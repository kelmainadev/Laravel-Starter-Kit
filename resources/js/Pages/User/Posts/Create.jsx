import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        status: 'published',
        tags: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.posts.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Post
                    </h2>
                    <Link href={route('user.posts.index')}>
                        <Button variant="outline">Back to Posts</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Create Post" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                            <CardDescription>
                                Create a new post to share your thoughts and ideas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                        placeholder="Enter post title"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className={errors.excerpt ? 'border-red-500' : ''}
                                        placeholder="Brief description of your post"
                                        rows={2}
                                    />
                                    {errors.excerpt && (
                                        <p className="text-sm text-red-600">{errors.excerpt}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className={errors.content ? 'border-red-500' : ''}
                                        placeholder="Write your post content here..."
                                        rows={10}
                                        required
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content}</p>
                                    )}
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
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>
                                        <Input
                                            id="tags"
                                            type="text"
                                            value={data.tags}
                                            onChange={(e) => setData('tags', e.target.value)}
                                            className={errors.tags ? 'border-red-500' : ''}
                                            placeholder="Comma separated tags"
                                        />
                                        {errors.tags && (
                                            <p className="text-sm text-red-600">{errors.tags}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Separate tags with commas (e.g., technology, web, tutorial)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Post'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setData('status', 'draft')}
                                        disabled={processing}
                                    >
                                        Save as Draft
                                    </Button>
                                    <Link href={route('user.posts.index')}>
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