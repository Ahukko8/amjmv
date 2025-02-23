/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = 'document.pdf' }: PDFViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/pdfs');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-4 font-faseyha">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end items-center bg-white p-4 rounded-lg shadow">
        <Button
          variant="default"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          ފަހަތް
        </Button>
      </div>

      <div className="bg-gray-100 rounded-lg shadow p-4 h-[calc(100vh-200px)] flex items-center justify-center">
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          />
          <p className="text-center text-gray-500">
            PDF ދައްކަން ނުމަގާނެ. ޑައުންލޯޑް ކޮށްލުމަށް ކަމަންދާރު.
          </p>
        </object>
      </div>
    </div>
  );
};

export default PDFViewer;