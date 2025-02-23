/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PDFViewer from '@/components/PDFViewer';
import React from 'react';

interface PDFPageProps {
  params: Promise<{ id: string }>;
}

export default function PDFReader({ params }: PDFPageProps) {
  const { id } = React.use(params);
  const [pdf, setPdf] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`/api/pdfs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const data = await response.json();
        setPdf(data.pdf);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        router.push('/pdfs');
      }
    };
    fetchPDF();
  }, [id, router]);

  if (!pdf) return <div className="text-center py-12 font-faseyha">ލޯޑިން...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 font-faseyha">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-right">
          {pdf.title}
        </h1>
        <PDFViewer
          pdfUrl={pdf.pdfFile}
          filename={`${pdf.title}.pdf`}
        />
      </div>
    </div>
  );
}