"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = "document.pdf" }: PDFViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-full sm:max-w-7xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-100 rounded-xl shadow-lg p-4 sm:p-6 h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] flex flex-col items-center justify-center overflow-hidden">
          {/* For Desktop: Try embedding PDF */}
          {!isMobile ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg"
              onError={() => setError("Failed to load PDF. Please download it instead.")}
            >
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full rounded-lg"
              />
              <FallbackContent pdfUrl={pdfUrl} filename={filename} />
            </object>
          ) : (
            /* For Mobile: Show download link directly */
            <FallbackContent pdfUrl={pdfUrl} filename={filename} />
          )}
        </div>
      </main>
    </div>
  );
};

// Fallback content for when PDF can't be displayed
const FallbackContent = ({ pdfUrl, filename }: PDFViewerProps) => (
  <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
    <p>PDF cannot be displayed. Download it instead:</p>
    <a
      href={pdfUrl}
      download={filename}
      className="mt-2 inline-block text-emerald-600 hover:text-emerald-800 underline font-medium"
    >
      Download {filename}
    </a>
  </div>
);

export default PDFViewer;