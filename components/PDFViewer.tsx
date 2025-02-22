import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFViewerProps {
  pdfUrl: string;
  filename?: string;
}

const PDFViewer = ({ pdfUrl, filename = 'document.pdf' }: PDFViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
      console.error(err);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            onClick={handleDownload}
            className="ml-4"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg shadow p-4 min-h-[600px] flex items-center justify-center">
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          />
          <p className="text-center text-gray-500">
            PDF cannot be displayed. Please download to view.
          </p>
        </object>
      </div>
    </div>
  );
};

export default PDFViewer;