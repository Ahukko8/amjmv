/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FiDownload, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Script from 'next/script';

interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = 'document.pdf' }: PDFViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize PDFObject once script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    try {
      // PDFObject will be available globally after script loads
      const PDFObject = (window as any).PDFObject;
      const embedded = PDFObject.embed(
        pdfUrl,
        containerRef.current, 
        {
          id: "pdf-viewer",
          pdfOpenParams: {
            navpanes: 0,
            toolbar: 0,
            statusbar: 0,
            view: "FitH"
          }
        }
      );
      
      if (embedded) {
        // Get the iframe that PDFObject creates
        iframeRef.current = document.getElementById("pdf-viewer") as HTMLIFrameElement;
        
        // Listen for iframe load to access PDF.js
        if (iframeRef.current) {
          iframeRef.current.onload = () => {
            setIsLoading(false);
            tryToGetPageInfo();
          };
        }
      } else {
        // Fallback if embedding fails
        setError('PDF ދެއްކުމަށް ސަޕޯޓް ނުކުރޭ. ޑައުންލޯޑް ކޮށްލުމަށް ބޭނުންކުރޭ.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error initializing PDF viewer:', err);
      setError('PDF ލޯޑް ކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
      setIsLoading(false);
    }
  }, [isScriptLoaded, pdfUrl]);

  // Try to access PDF.js inside the iframe to get page information
  const tryToGetPageInfo = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Check if we can access PDF.js variables
        const pdfViewer = (iframeRef.current.contentWindow as any).PDFViewerApplication;
        
        if (pdfViewer && pdfViewer.pdfViewer) {
          // Get total pages
          setTotalPages(pdfViewer.pagesCount || 1);
          
          // Set up a page change listener
          const updatePageNumber = () => {
            if (pdfViewer && pdfViewer.page) {
              setCurrentPage(pdfViewer.page);
            }
          };
          
          // Initial page number
          updatePageNumber();
          
          // Listen for page changes
          if (pdfViewer.eventBus) {
            pdfViewer.eventBus.on('pagechanging', updatePageNumber);
          }
        }
      }
    } catch (e) {
      console.log('Could not access PDF.js API in iframe, using basic viewer');
    }
  };

  // Navigation functions
  const goToPreviousPage = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const pdfViewer = (iframeRef.current.contentWindow as any).PDFViewerApplication;
        if (pdfViewer && pdfViewer.page > 1) {
          pdfViewer.page = pdfViewer.page - 1;
          setCurrentPage(pdfViewer.page);
        }
      }
    } catch (e) {
      console.error('Could not navigate to previous page', e);
    }
  };

  const goToNextPage = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const pdfViewer = (iframeRef.current.contentWindow as any).PDFViewerApplication;
        if (pdfViewer && pdfViewer.page < pdfViewer.pagesCount) {
          pdfViewer.page = pdfViewer.page + 1;
          setCurrentPage(pdfViewer.page);
        }
      }
    } catch (e) {
      console.error('Could not navigate to next page', e);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Load PDFObject script */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.2.8/pdfobject.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => setError('PDF ވިއުވަރ ލޯޑް ކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ')}
        strategy="afterInteractive"
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousPage} 
            disabled={isLoading || currentPage <= 1}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            aria-label="Previous page"
          >
            <FiArrowLeft className="mr-1" />
            <span className="hidden sm:inline">ފަހަތަށް</span>
          </button>
          
          <span className="text-sm">
            {isLoading ? 'ލޯޑިން...' : `${currentPage} / ${totalPages}`}
          </span>
          
          <button 
            onClick={goToNextPage} 
            disabled={isLoading || currentPage >= totalPages}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">ކުރިއަށް</span>
            <FiArrowRight className="ml-1" />
          </button>
        </div>
        
        <a 
          href={pdfUrl} 
          download={filename}
          className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          <FiDownload className="mr-1" />
          <span className="hidden sm:inline">ޑައުންލޯޑް</span>
        </a>
      </div>

      {/* PDF Container */}
      <div className="relative flex-grow" style={{ height: 'calc(100% - 50px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-2"></div>
              <div>ލޯޑިން...</div>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        ></div>
        
        {/* Fallback message */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-gray-800 bg-opacity-75 text-white px-4 py-2 rounded-full text-sm pointer-events-auto">
            PDF ނުފެންނަންޏާ{' '}
            <a
              href={pdfUrl}
              download={filename}
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              ޑައުންލޯޑް ކުރޭ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add TypeScript declaration for PDFObject
declare global {
  interface Window {
    PDFObject: any;
  }
}

export default PDFViewer;