"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
}

interface EditPDFProps {
  params: Promise<{ id: string }>; // Updated to Promise type
}

export default function EditPDF({ params }: EditPDFProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<PDF | null>(null);
  const router = useRouter();

  const { id } = React.use(params); // Unwrap params with React.use()

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`/api/pdfs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const data = await response.json();
        setInitialData(data.pdf);
        setTitle(data.pdf.title);
        setDescription(data.pdf.description || '');
      } catch (error) {
        console.error('Error fetching PDF:', error);
        router.push('/admin/dashboard/pdfs');
      }
    };
    fetchPDF();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
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

  if (!initialData) return <div className="text-center py-12 font-faseyha">ލޯޑިން...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 font-faseyha">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-right">Edit PDF</h1>
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
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-right">PDF ފައިލް</label>
          <p className="text-sm text-gray-500 text-right">Current: {initialData.pdfFile.split('/').pop()}</p>
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
            <p className="text-sm text-gray-500 text-right">Current: {initialData.image.split('/').pop()}</p>
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