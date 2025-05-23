import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { ArrowLeft, Check, X, Flag, Trash2 } from 'lucide-react';

export default function Show({ post }) {
  const [notes, setNotes] = useState('');

  function getStatusBadge(status) {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'published':
        return <Badge variant="success" className="bg-green-100 text-green-800">Published</Badge>;
      case 'flagged':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Flagged</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  function handleApprove() {
    router.put(route('admin.moderation.approve', post.id), {
      notes,
    });
  }

  function handleReject() {
    router.put(route('admin.moderation.reject', post.id), {
      notes,
    });
  }

  function handleFlag() {
    router.put(route('admin.moderation.flag', post.id), {
      notes,
    });
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this post?")) {
      router.delete(route('admin.moderation.destroy', post.id));
    }
  }

  return (
    <AdminLayout>
      <Head title={`Moderate: ${post.title}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href={route('admin.moderation.index')} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Moderation Queue
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{post.title}</CardTitle>
                      <div className="text-sm text-gray-500 mt-1">
                        By: {post.user.name} ({post.user.email})
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {post.content}
                  </div>
                  
                  {post.moderation_notes && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                      <h3 className="text-sm font-medium text-gray-900">Previous Moderation Notes:</h3>
                      <p className="mt-2 text-sm text-gray-700">{post.moderation_notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  <div>
                    Created: {new Date(post.created_at).toLocaleString()}
                    {post.created_at !== post.updated_at && (
                      <span> | Updated: {new Date(post.updated_at).toLocaleString()}</span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Moderation Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Moderation Notes:
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this content..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleApprove}
                        variant="outline"
                        className="w-full flex items-center justify-center border-green-500 hover:bg-green-50 text-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="outline"
                        className="w-full flex items-center justify-center border-red-500 hover:bg-red-50 text-red-600"
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleFlag}
                        variant="outline"
                        className="w-full flex items-center justify-center"
                      >
                        <Flag className="mr-2 h-4 w-4" /> Flag
                      </Button>
                      <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="w-full flex items-center justify-center text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 