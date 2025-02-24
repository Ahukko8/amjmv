"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface Author {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  author: Author;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  fontFamily: string;
  fontSize: string;
}

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/admin'); // Redirect to admin home if not signed in
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn) fetchBlogs();
  }, [isSignedIn]);



  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog._id !== id));
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handlePublishToggle = async (blog: Blog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBlogs(blogs.map(b => 
          b._id === blog._id ? { ...b, status: newStatus } : b
        ));
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Failed to update blog status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div className="space-y-6 p-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">ބުލޮގްތައް</h1>
      <div className="gap-2 flex flex-row">
        <Link href="/admin/dashboard/pdfs" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
          PDF މެނޭޖްމަންޓް
        </Link>
        <Link href="/admin/dashboard/categories" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          ކެޓަގަރީތައް
        </Link>
        <Link href="/admin/dashboard/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          ބުލޮގެއް ހަދާ
        </Link>
      </div>
    </div>
      {/* Mobile: Card layout, Desktop: Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table for medium screens and up */}
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
                      onClick={() => router.push(`/admin/dashboard/edit/${blog._id}`)}
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

        {/* Card layout for mobile screens */}
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
                  onClick={() => router.push(`/admin/dashboard/edit/${blog._id}`)}
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
    </div>
  );
}