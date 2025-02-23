/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPdfs, setTotalPdfs] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPDFs();
  }, [currentPage]);

  const fetchPDFs = async () => {
    try {
      const response = await fetch(`/api/pdfs?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch PDFs');
      const data = await response.json();
      setPdfs(data.pdfs);
      setTotalPdfs(data.total);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPdfs / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true); // Show loading state during page change
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 font-faseyha">
      {/* Minimal Header */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">ފީސީ ލިޔުން</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base">
            ފުރަތަމަ ޞަފްޙާ
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pdfs.map((pdf) => (
                  <Link key={pdf._id} href={`/pdfs/${pdf._id}`} className="group">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                      {pdf.image && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={pdf.image}
                            alt={pdf.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-right text-gray-900 line-clamp-2">
                          {pdf.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 text-right line-clamp-2">
                          {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <PaginationComponent>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {pageNumbers[0] > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {pageNumbers[0] > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                        </>
                      )}

                      {pageNumbers.map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <PaginationItem><PaginationEllipsis /></PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </PaginationComponent>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-indigo-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© {new Date().getFullYear()} PDFs Page. ހަމަ ހައްގުތައް ރައްކާތެރި.</p>
        </div>
      </footer>
    </main>
  );
}