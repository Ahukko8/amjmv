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

interface PDF {
  _id: string;
  title: string;
  description?: string;
  category: Category;
  createdAt: string;
}

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blogs' | 'pdfs' | 'categories'>('blogs');
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/admin'); // Redirect to admin home if not signed in
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetchBlogs();
      fetchPDFs();
      fetchCategories();
    }
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

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/pdfs?limit=10');
      if (!response.ok) throw new Error('Failed to fetch PDFs');
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=10');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteBlog = async (id: string) => {
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

  const handleDeletePDF = async (id: string) => {
    if (!confirm('PDF ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/pdfs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPdfs(pdfs.filter(pdf => pdf._id !== id));
      } else {
        throw new Error('Failed to delete PDF');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Failed to delete PDF');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('ކެޓަގަރީ ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(category => category._id !== id));
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
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
        <h1 className="text-2xl font-semibold">އެޑްމިން ޑެޝްބޯޑް</h1>
        <div className="gap-2 flex flex-row">
          <Link href="/admin/dashboard/categories" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
            ކެޓަގަރީތައް
          </Link>
          <Link href="/admin/dashboard/pdfs" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
            PDF މެނޭޖްމަންޓް
          </Link>
          <Link href="/admin/dashboard/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            ބުލޮގެއް ހަދާ
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blogs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ބުލޮގްތައް ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pdfs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            PDF ތައް ({pdfs.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
          ކެޓަގަރީތައް ({categories.length})
          </button>
        </nav>
      </div>

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
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
                        onClick={() => handleDeleteBlog(blog._id)}
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
                    onClick={() => handleDeleteBlog(blog._id)}
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

      {/* PDFs Tab */}
      {activeTab === 'pdfs' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">PDF ލިޔުންތައް</h3>
              <Link
                href="/admin/dashboard/pdfs/upload"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                PDF އަޅާލަން
              </Link>
            </div>
          </div>
          
          {/* Table for medium screens and up */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ސުރުޙީ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ކެޓަގަރީ
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
                {pdfs.map((pdf) => (
                  <tr key={pdf._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">{pdf.title}</div>
                      {pdf.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">{pdf.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {pdf.category && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {pdf.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(pdf.createdAt).toLocaleDateString('dv-MV')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/dashboard/pdfs/edit/${pdf._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                      >
                        އެޑިޓް
                      </button>
                      <button
                        onClick={() => handleDeletePDF(pdf._id)}
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
            {pdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-sm font-medium text-gray-900 text-right">{pdf.title}</h2>
                {pdf.description && (
                  <p className="text-xs text-gray-500 text-right mt-1 line-clamp-2">{pdf.description}</p>
                )}
                <div className="mt-2 text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(pdf.createdAt).toLocaleDateString('dv-MV')}
                  </p>
                  {pdf.category && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {pdf.category.name}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => router.push(`/admin/dashboard/pdfs/edit/${pdf._id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    އެޑިޓް
                  </button>
                  <button
                    onClick={() => handleDeletePDF(pdf._id)}
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

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">ކެޓަގަރީތައް</h3>
              <Link
                href="/admin/dashboard/categories/create"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                ކެޓަގަރީ އެޅުން
              </Link>
            </div>
          </div>
          
          {/* Table for medium screens and up */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ނަން
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ސްލަގް
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ހަދަންވީގޮތް
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/dashboard/categories/edit/${category._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                      >
                        އެޑިޓް
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
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
            {categories.map((category) => (
              <div
                key={category._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-sm font-medium text-gray-900 text-right">{category.name}</h2>
                <p className="text-xs text-gray-500 text-right mt-1">{category.slug}</p>
                <div className="mt-3 flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => router.push(`/admin/dashboard/categories/edit/${category._id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    އެޑިޓް
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
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