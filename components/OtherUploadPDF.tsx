"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { otherCategory } from '@/types/otherCategory';

interface OtherPDFProps {
  initialData?: {
    title?: string;
    content?: string;
    categories?: string[];
    image?: string;
  };
}

export default function OtherUploadPDF({ initialData }: OtherPDFProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [categories, setCategories] = useState<otherCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.categories?.[0] || '');
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/otherCategories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !pdfFile || !selectedCategory) {
      setError('Title, PDF file, and Category are required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('pdfFile', pdfFile);
    if (image) formData.append('image', image);
    formData.append('categories', selectedCategory); // ✅ Send selected category

    try {
      console.log('Sending form data to /api/otherPdfs');
      const response = await fetch('/api/otherPdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      console.log('PDF upload successful');
      router.push('/admin/otherChannel/pdfs');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error uploading PDF:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-faseyha">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-right">PDF އަޕްލޯޑް</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md text-right">
          {error}
        </div>
      )}
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
          <label className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">ކެޓަގަރީ</label>
          {categoriesLoading ? (
            <div className="text-gray-500 text-sm">Loading categories...</div>
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full h-10 sm:h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
            >
              <option value="">ކެޓަގަރީއެއް ހޮވާ</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">PDF ފައިލް</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">ފޮޓޯ</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            ކެންސަލްކުރޭ
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'އަޅާލަނީ...' : 'PDF އަޅާލަން'}
          </Button>
        </div>
      </form>
    </div>
  );
}
