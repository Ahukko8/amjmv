/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFViewerProps {
  pdfUrl: string;
  imageUrl?: string; // Optional URL to the preview image
  filename?: string;
}

const PDFViewer = ({
  pdfUrl,
  imageUrl,
  filename = "document.pdf",
}: PDFViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleError = () => {
    setError("PDF ލޯޑް ކުރުމަށް ނުކުރެވުނު. ޑައުންލޯޑް ކޮށްލުމަށް މަސައްކަތް ކުރޭ.");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-100 rounded-xl shadow-lg p-4 sm:p-6 w-full h-[calc(100vh-120px)] overflow-auto">
        {isMobile ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 text-sm sm:text-base">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="PDF Preview"
                className="max-w-full max-h-[50vh] object-contain mb-4 rounded-lg"
              />
            ) : (
              <p className="mb-4">ޕްރިވިއު އިމޭޖެއް ނެތް</p> // "No preview image"
            )}
            <a
              href={pdfUrl}
              download={filename}
              className="text-emerald-600 hover:text-emerald-800 underline"
              onClick={(e) => {
                if (!document.createEvent) {
                  e.preventDefault();
                  window.location.href = pdfUrl;
                }
              }}
            >
              ޑައުންލޯޑް ކުރައްވާ
            </a>
          </div>
        ) : (
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full rounded-lg"
            onError={handleError}
          >
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg"
            />
            <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
              PDF ދައްކަން ނުމަގާނެ. ޑައުންލޯޑް ކޮށްލުމަށް{" "}
              <a
                href={pdfUrl}
                download={filename}
                className="text-emerald-600 hover:text-emerald-800 underline"
              >
                ކަމަންދާރު
              </a>
            </div>
          </object>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;