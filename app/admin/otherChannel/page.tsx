"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Loading from '@/components/Loading';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface OtherBlog {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  fontFamily: string;
  fontSize: string;
}

interface ApiResponse {
  blogs?: OtherBlog[];
  message?: string;
}

export default function OtherChannelDashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const [blogs, setBlogs] = useState<OtherBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/admin'); // Redirect to admin home if not signed in
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    const safelyFetchBlogs = async () => {
      if (isSignedIn) {
        await fetchBlogs();
      }
    };

    safelyFetchBlogs();
  }, [isSignedIn]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/otherChannelBlogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch blogs');
      }

      const data: ApiResponse = await response.json();

      if (!data.blogs) {
        setBlogs([]);
        setError('No blogs found');
        return;
      }

      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/otherChannelBlogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      setBlogs(currentBlogs => currentBlogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete blog');
    }
  };

  const handlePublishToggle = async (blog: OtherBlog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      const response = await fetch(`/api/otherChannelBlogs/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog status');
      }

      setBlogs(currentBlogs => 
        currentBlogs.map(b => 
          b._id === blog._id ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update blog status');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isSignedIn) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">ބުލޮގްތައް</h1>
        <div className="gap-2 flex flex-row">
        <Link href="/admin/otherChannel/pdfs" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
          PDF މެނޭޖްމަންޓް
        </Link>
          <Link href="/admin/otherChannel/categories" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
            ކެޓަގަރީތައް
          </Link>
          <Link href="/admin/otherChannel/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            ބުލޮގެއް ހަދާ
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {blogs.length === 0 && !error ? (
        <div className="text-center text-gray-500 p-4">
          No blogs found
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ނަން
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ކެޓަގަރީތައް
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ސުޓޭޓަސް
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ތާރީޚު
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ހަދަންވީގޮތް
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {blog.categories?.map((category) => (
                          <span
                            key={category._id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handlePublishToggle(blog)}
                        className={`${
                          blog.status === 'published'
                            ? 'text-yellow-600 hover:text-yellow-900'
                            : 'text-green-600 hover:text-green-900'
                        } mx-2`}
                      >
                        {blog.status === 'published' ? 'އަންޕަބްލިޝް' : 'ޕަބްލިޝް'}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/otherChannel/edit/${blog._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                      >
                        އެޑިޓް
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-900 mx-2"
                      >
                        ޑިލީޓް
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-sm font-medium text-gray-900 text-right">{blog.title}</h2>
                <div className="mt-2 text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                  </p>
                  <div className="flex flex-wrap justify-end gap-1 mt-1">
                    {blog.categories?.map((category) => (
                      <span
                        key={category._id}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      blog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>
                <div className="mt-3 flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => handlePublishToggle(blog)}
                    className={`${
                      blog.status === 'published'
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {blog.status === 'published' ? 'އަންޕަބްލިޝް' : 'ޕަބްލިޝް'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/otherChannel/edit/${blog._id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    އެޑިޓް
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ޑިލީޓް
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}