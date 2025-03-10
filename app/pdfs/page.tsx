/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

  const ITEMS_PER_PAGE = 2;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

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
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <main className="min-h-screen bg-[#F5F5F5] font-faseyha">
      <Header />

      {/* Hero Section with Title and Description */}
      <section className="sm:py-16 text-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl mt-5 md:text-5xl font-bold mb-4">
               ޕީޑީއެފް ލިޔުންތައް
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-[#121212]">
          ޕީޑީއެފް ލިޔުންތަކާއި ފޮތްތައް ޑައުންލޯޑް ކުރުމަށް މިތަނުން ފެންނާނެ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="h-80 bg-[#F5F5F5] rounded-xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {pdfs.map((pdf) => (
                  <motion.div key={pdf._id} variants={fadeInUp}>
                    <Link href={`/pdfs/${pdf._id}`} className="block group h-full">
                      <div className="bg-[#F5F5F5]/20 rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-[#121212]/20 h-full flex flex-col">
                        {pdf.image ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={pdf.image}
                              alt={pdf.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#121212]/10 group-hover:bg-[#121212]/20 transition-all duration-300"></div>
                          </div>
                        ) : (
                          <div className="relative h-48 w-full bg-[#F5F5F5] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-right text-[#121212] line-clamp-2">
                              {pdf.title}
                            </h3>
                            <p className="mt-2 text-sm text-[#121212] text-right line-clamp-2">
                              {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                            </p>
                          </div>
                          <div className="mt-4 text-right">
                            <span className="text-[#121212] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              ޑައުންލޯޑް ކުރޭ →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {pdfs.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#121212]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-[#121212]">ފައިލެއް ނެތް</h3>
                  <p className="mt-2 text-[#121212]">މިވަގުތު ޕީޑީއެފް ލިޔުންތަކެއް ނެތް، ފަހުން އަނބުރާ ވަޑައިގަންނަވާ</p>
                </div>
              )}

              {/* Pagination with Emerald Theme */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <PaginationComponent>
                    <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-0">
                      <PaginationItem className="hidden sm:block">
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={`${currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-[#121212] hover:text-[#121212]/80 border-[#121212]/20 hover:bg-[#121212]/10`}
                        />
                      </PaginationItem>

                      {pageNumbers[0] > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => handlePageChange(1)} 
                              className="cursor-pointer border-[#121212]/20 text-[#F5F5F5] hover:text-[#F5F5F5]/40 hover:bg-[#121212]/10"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {pageNumbers[0] > 2 && <PaginationItem><PaginationEllipsis className="text-[#121212]" /></PaginationItem>}
                        </>
                      )}

                      {pageNumbers.map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer ${
                              currentPage === page 
                                ? 'bg-white text-[#121212] hover:bg-[#121212]/10 border-[#121212]/20' 
                                : 'text-[#121212] hover:text-[#121212] border-border-[#121212]/10 hover:bg-[#121212]/10'
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <PaginationItem><PaginationEllipsis className="text-[#121212]" /></PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => handlePageChange(totalPages)} 
                              className="cursor-pointer border-[#121212]/20 text-[#F5F5F5] hover:text-[#F5F5F5]/40 hover:bg-[#121212]/10"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem className="hidden sm:block">
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={`${currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-[#121212] hover:[#121212] border-[#121212]/20 hover:bg-[#121212]/10`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </PaginationComponent>
                </div>
              )}

              {/* Mobile Pagination Buttons */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-between sm:hidden">
                  <button
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed border-[#121212]/20 text-[#121212]'
                        : 'border-[#121212]/20 text-[#121212] hover:bg-[#121212]/10'
                    }`}
                  >
                    ކުރީގެ ޞަފްޙާ
                  </button>
                  <button
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed border-[#121212]/20 text-[#121212]'
                      : 'border-[#121212]/20 text-[#121212] hover:bg-[#121212]/10'
                  }`}
                  >
                    ދެން އޮތް ޞަފްޙާ
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}