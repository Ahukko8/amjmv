/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  category: Category;
  createdAt: string;
}

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPdfs, setTotalPdfs] = useState(0);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
    fetchPDFs();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=100');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`;
      const response = await fetch(`/api/pdfs?page=1&limit=100${categoryParam}`);
      if (!response.ok) throw new Error('Failed to fetch PDFs');
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('PDF ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/pdfs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete PDF');
      setPdfs(pdfs.filter((pdf) => pdf._id !== id));
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Failed to delete PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">PDF މެނޭޖްމަންޓް</h1>
        <div className="gap-2 flex flex-row">
          <Link
            href="/admin/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            އަނބުރާ
          </Link>
          <Link
            href="/admin/dashboard/pdfs/upload"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            PDF އަޅާލަން
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-right mb-3">ކެޓަގަރީން ފިލްޓަރ ކުރޭ</h2>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            ހުރިހާ ބައި
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${selectedCategory === category._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* PDF List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table for medium screens and up */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ސުރުޙީ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ތަފްޞީލް
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
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">{pdf.title}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                    </div>
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
                      onClick={() => handleDelete(pdf._id)}
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
                <p className="text-xs text-gray-500 text-right mt-1 line-clamp-2">
                  {pdf.description}
                </p>
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
                  onClick={() => handleDelete(pdf._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  ޑިލީޓް
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pdfs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-500">
            {selectedCategory === 'all'
              ? 'ވަކިމެ PDF އެއްވެސް ނެތް'
              : 'މި ކެޓަގަރީގައި PDF ލިބިފައެއް ނުވޭ'
            }
          </p>
        </div>
      )}
    </div>
  );
}
