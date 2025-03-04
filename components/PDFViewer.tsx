/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';


interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = 'document.pdf' }: PDFViewerProps) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-full sm:max-w-7xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-100 rounded-xl shadow-lg p-4 sm:p-6 h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] flex items-center justify-center">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full rounded-lg"
          >
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg"
            />
            <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
              PDF ދައްކަން ނުމަގާނެ. ޑައުންލޯޑް ކޮށްލުމަށް{' '}
              <a 
                href={pdfUrl} 
                download={filename}
                className="text-emerald-600 hover:text-emerald-800 underline"
              >
                ކަމަންދާރު
              </a>
            </div>
          </object>
        </div>
      </main>
    </div>
  );
};

export default PDFViewer;