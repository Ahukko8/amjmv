"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function PDFUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=100');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('ބާވަތްތައް ލޯޑްކުރެވެނީ. ފަހުން އަނބުރާ މަސައްކަތް ކުރައްވާ.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      alert('PDF ފައިލެއް ހޮއްވާ');
      return;
    }

    if (!categoryId) {
      alert('ބާވަތެއް ހޮއްވާ');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categoryId);
    formData.append('pdfFile', pdfFile);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('/api/pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      router.push('/admin/dashboard/pdfs');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('PDF އަޅުއަލެވެނީ. ފަހުން އަނބުރާ މަސައްކަތް ކުރައްވާ.');
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-faseyha">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">ބާވަތްތައް ލޯޑިން...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-faseyha">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-right">PDF އަޅާލަން</h1>
        <button
          onClick={() => router.push('/admin/dashboard/pdfs')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          އަނބުރާ
        </button>
      </div>

      {categories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 text-right">
                ބާވަތަކަށް ނުލެވޭ
              </h3>
              <div className="mt-2 text-sm text-yellow-700 text-right">
                <p>
                  PDF އަޅުއަލުމަށް ކުރީ ބާވަތެއް ހަދަންވާނެ.{' '}
                  <button
                    onClick={() => router.push('/admin/dashboard/categories/create')}
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    ބާވަތެއް ހަދާ
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">
            ސުރުޙީ *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
            placeholder="PDF ގެ ސުރުޙީ ލިޔާ"
          />
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">
            ތަފްޞީލް
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            rows={4}
            placeholder="PDF ގެ ތަފްޞީލް ލިޔާ (އެދި އެދުން)"
          />
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">
            ބާވަތް *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
            disabled={categories.length === 0}
          >
            <option value="">ބާވަތެއް ހޮއްވާ</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-1 text-sm text-red-600 text-right">
              ބާވަތްތަކެއް ނުލެވޭ. ބާވަތެއް ހަދަން <button
                type="button"
                onClick={() => router.push('/admin/dashboard/categories/create')}
                className="underline hover:no-underline"
              >
                މިއިން ވާނ
              </button>
            </p>
          )}
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">
            PDF ފައިލް *
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
          <p className="mt-1 text-sm text-gray-500 text-right">
            PDF ފައިލެއް ހޮއްވާ (މެކްސް 50MB)
          </p>
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">
            ފޮޓޯ
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-sm text-gray-500 text-right">
            PDF ގެ ކަވަރ ފޮޓޯ (އެދި އެދުން)
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'އަޅުއަލަނީ...' : 'PDF އަޅުއަލާ'}
          </button>
        </div>
      </form>
    </div>
  );
}