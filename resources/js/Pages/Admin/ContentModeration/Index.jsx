import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchFilter from '@/Components/SearchFilter';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Pencil, Trash2, Flag, Check, X } from 'lucide-react';

export default function Index({ posts, filters }) {
  const [search, setSearch] = useState(filters.search || '');

  function handleSearch(e) {
    e.preventDefault();
    router.get(route('admin.moderation.index'), { search }, { preserveState: true });
  }

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

  return (
    <AdminLayout>
      <Head title="Content Moderation" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Content Needing Moderation</h1>
                <Link href={route('admin.moderation.all')} className="text-blue-600 hover:text-blue-800">
                  View All Content
                </Link>
              </div>

              <SearchFilter 
                value={search} 
                onChange={setSearch} 
                onSubmit={handleSearch} 
                placeholder="Search by title, content, or user..." 
              />

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.data.length > 0 ? (
                      posts.data.map((post) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              <Link href={route('admin.moderation.show', post.id)} className="hover:underline">
                                {post.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{post.user.name}</div>
                            <div className="text-xs text-gray-400">{post.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-3">
                              <Link href={route('admin.moderation.show', post.id)}>
                                <Button variant="outline" size="icon" className="w-8 h-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link 
                                href={route('admin.moderation.destroy', post.id)} 
                                method="delete" 
                                as="button"
                                type="button"
                              >
                                <Button variant="outline" size="icon" className="w-8 h-8 text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No posts need moderation at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {posts.links && (
                <div className="mt-6">
                  {/* Pagination here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 