"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Set up the worker for react-pdf (using CDN for simplicity)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = "document.pdf" }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-full sm:max-w-7xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-100 rounded-xl shadow-lg p-4 sm:p-6 h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] overflow-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => setError(`Failed to load PDF: ${err.message}. Please download it instead.`)}
          >
            {numPages &&
              Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={Math.min(800, window.innerWidth - 40)} // Responsive width
                  renderTextLayer={false} // Optional: Disable text layer for performance
                  renderAnnotationLayer={false} // Optional: Disable annotations
                />
              ))}
          </Document>
          <div className="mt-4 text-center">
            <a
              href={pdfUrl}
              download={filename}
              className="text-emerald-600 hover:text-emerald-800 underline font-medium"
            >
              Download {filename}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFViewer;