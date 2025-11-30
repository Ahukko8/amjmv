"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

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
  category: Category;
}

interface EditPDFProps {
  params: Promise<{ id: string }>; // Updated to Promise type
}

export default function EditPDF({ params }: EditPDFProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<PDF | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const { id } = React.use(params); // Unwrap params with React.use()

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      fetchPDF();
    }
  }, [id]);

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

  const fetchPDF = async () => {
    try {
      const response = await fetch(`/api/pdfs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      const data = await response.json();
      setInitialData(data.pdf);
      setTitle(data.pdf.title);
      setDescription(data.pdf.description || '');
      setCategoryId(data.pdf.category?._id || '');
    } catch (error) {
      console.error('Error fetching PDF:', error);
      router.push('/admin/dashboard/pdfs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      alert('ބާވަތެއް ހޮއްވާ');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categoryId);
    if (pdfFile) formData.append('pdfFile', pdfFile);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`/api/pdfs/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update PDF');
      router.push('/admin/dashboard/pdfs');
    } catch (error) {
      console.error('Error updating PDF:', error);
      alert('Failed to update PDF');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData || categories.length === 0) {
    return <div className="text-center py-12 font-faseyha">ލޯޑިން...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-faseyha">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-right">PDF އެޑިޓްކުރޭ</h1>
        <button
          onClick={() => router.push('/admin/dashboard/pdfs')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          އަނބުރާ
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">ސުރުޙީ</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">ތަފްޞީލް</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">ބާވަތް</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            required
          >
            <option value="">ބާވަތެއް ހޮއްވާ</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {initialData.category && (
            <p className="text-sm text-gray-500 text-right mt-1">
              މިހާރުގެ: {initialData.category.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">PDF ފައިލް</label>
          <p className="text-sm text-gray-500 text-right">މިހާރުގެ: {initialData.pdfFile.split('/').pop()}</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">ފޮޓޯ</label>
          {initialData.image && (
            <p className="text-sm text-gray-500 text-right">މިހާރުގެ: {initialData.image.split('/').pop()}</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'އަޕްޑޭޓިން...' : 'އަޕްޑޭޓް'}
          </button>
        </div>
      </form>
    </div>
  );
}