/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
  const router = useRouter();

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
    if (!confirm('Are you sure you want to delete this PDF?')) return;

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

  return (
    <div className="space-y-6 p-4 sm:p-6 font-faseyha">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-right">PDF މެނޭޖްމަންޓް</h1>
        <div className='flex gap-2 flex-row'>
          <Link
            href="/admin/dashboard/pdfs/upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            PDF އަޅާލަން
          </Link>
          <Link
            href="/admin/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            އަނބުރާ
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-right mb-3">ބާވަތް ހޮއްވާ</h2>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse shadow-md" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <div
              key={pdf._id}
              className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              {pdf.image && (
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src={pdf.image}
                    alt={pdf.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-right text-gray-900 line-clamp-2">
                {pdf.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-right line-clamp-3">
                {pdf.description || 'ތަފްޞީލެއް ނެތް'}
              </p>
              {pdf.category && (
                <div className="mt-2 text-right">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {pdf.category.name}
                  </span>
                </div>
              )}
              <div className="mt-4 flex justify-end gap-4">
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
      )}

      {pdfs.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {selectedCategory === 'all' 
              ? 'ވަކިމެ PDF އެއްކުވެސް ނެތް' 
              : 'މި ބާވަތުގައި PDF އެހެން ނުލެވޭ'
            }
          </p>
        </div>
      )}
    </div>
  );
}