"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  createdAt: string;
}

export default function OtherPDFManagement() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/otherPdfs?page=1&limit=100');
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
      const response = await fetch(`/api/otherPdfs/${id}`, {
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
            href="/admin/otherChannel/pdfs/upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            PDF އަޅާލަން
          </Link>
          <Link
            href="/admin/otherChannel"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            އަނބުރާ
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(pdf.createdAt).toLocaleDateString('dv-MV')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/otherChannel/pdfs/edit/${pdf._id}`)}
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
                </div>
                <div className="mt-3 flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => router.push(`/admin/otherChannel/pdfs/edit/${pdf._id}`)}
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
      )}
    </div>
  );
}