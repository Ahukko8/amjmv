"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  createdAt: string;
}

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/pdfs?page=1&limit=100');
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
    </div>
  );
}