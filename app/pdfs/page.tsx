"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
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

export default function PDFsPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/pdfs?page=1&limit=100'); // Adjust limit as needed
      if (!response.ok) throw new Error('Failed to fetch PDFs');
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-faseyha">
      <Header />
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-right text-gray-900">
            ފީސީ ޑޮކިއުމަންޓްތައް
          </h2>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse shadow-md" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pdfs.map((pdf) => (
                <Link key={pdf._id} href={`/pdfs/${pdf._id}`} className="block group">
                  <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}