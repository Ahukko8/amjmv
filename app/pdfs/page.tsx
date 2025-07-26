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
import PdfCategories from '@/components/PdfCategories';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  category: Category;
  createdAt: string;
}

export default function PDFsPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPdfs, setTotalPdfs] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ITEMS_PER_PAGE = 8;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  useEffect(() => {
    fetchPDFs();
  }, [currentPage, selectedCategory]);

  const fetchPDFs = async () => {
    try {
      const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`;
      const response = await fetch(`/api/pdfs?page=${currentPage}&limit=${ITEMS_PER_PAGE}${categoryParam}`);
      if (!response.ok) throw new Error('Failed to fetch PDFs');
      const data = await response.json();
      setPdfs(data.pdfs || []);
      setTotalPdfs(data.total || 0);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setPdfs([]);
      setTotalPdfs(0);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPdfs / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true); 
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
    setIsLoading(true);
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
    <main className="min-h-screen bg-white font-faseyha relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gray-50/30 rounded-full blur-3xl translate-x-1/2 animate-pulse delay-1000"></div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-black/10 backdrop-blur-sm border border-black/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black">
              ޕީޑީއެފް ލިޔުންތައް
            </h1>
            <p className="text-xl sm:text-2xl max-w-4xl mx-auto text-black/70 font-light leading-relaxed">
              ޕީޑީއެފް ލިޔުންތަކާއި ފޮތްތައް ޑައުންލޯޑް ކުރައްވާ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PdfCategories 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="h-80 bg-black/5 backdrop-blur-sm rounded-2xl animate-pulse border border-black/10 shadow-lg" />
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
                {pdfs.map((pdf, index) => (
                  <motion.div 
                    key={pdf._id} 
                    variants={fadeInUp}
                    custom={index}
                  >
                    <Link href={`/pdfs/${pdf._id}`} className="block group h-full">
                      <div className="bg-black/5 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 group-hover:bg-black/10 group-hover:-translate-y-3 border border-black/10 group-hover:border-black/20 h-full flex flex-col shadow-lg group-hover:shadow-2xl group-hover:shadow-black/10">
                        {pdf.image ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={pdf.image}
                              alt={pdf.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                          </div>
                        ) : (
                          <div className="relative h-48 w-full bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center border-b border-black/10">
                            <div className="p-4 rounded-2xl bg-black/10 backdrop-blur-sm shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-right text-black line-clamp-2 leading-relaxed">
                              {pdf.title}
                            </h3>
                            <p className="mt-3 text-sm text-black/70 text-right line-clamp-2 leading-relaxed">
                              {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                            </p>
                            {pdf.category && (
                              <div className="mt-2 text-right">
                                <span className="inline-block px-2 py-1 bg-black/10 backdrop-blur-sm rounded-lg text-xs text-black/70 border border-black/10">
                                  {pdf.category.name}
                                </span>
                              </div>
                            )}
                            {pdf.author && (
                              <p className="mt-2 text-xs text-black/50 text-right">
                                {pdf.author.name}
                              </p>
                            )}
                          </div>
                          <div className="mt-6 text-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-sm rounded-xl border border-black/20 text-black/70 text-sm group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm">
                              <span>ޑائުންލޯޑް ކުރޭ</span>
                              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {pdfs.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="bg-black/5 backdrop-blur-xl rounded-3xl border border-black/10 p-12 max-w-md mx-auto shadow-lg">
                    <div className="p-4 rounded-2xl bg-black/10 backdrop-blur-sm w-fit mx-auto mb-6 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-black mb-3">ފައިލެއް ނެތް</h3>
                    <p className="text-black/70 leading-relaxed">މި ބާވަތުގައި ޕީޑީއެފް ލިޔުންތަކެއް ނެތް، ފަހުން އަނބުރާ ވަޑައިގަންނަވާ</p>
                  </div>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-16 flex justify-center"
                >
                  <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-4 shadow-lg">
                    <PaginationComponent>
                      <PaginationContent className="flex flex-wrap justify-center gap-2">
                        <PaginationItem className="hidden sm:block">
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={`${
                              currentPage === 1 
                                ? 'pointer-events-none opacity-30 cursor-not-allowed' 
                                : 'cursor-pointer hover:scale-105'
                            } text-black hover:text-black border-black/20 hover:bg-black/20 bg-black/10 backdrop-blur-sm transition-all duration-300`}
                          />
                        </PaginationItem>

                        {pageNumbers[0] > 1 && (
                          <>
                            <PaginationItem>
                              <PaginationLink 
                                onClick={() => handlePageChange(1)} 
                                className="cursor-pointer border-black/20 text-black hover:text-black hover:bg-black/20 bg-black/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {pageNumbers[0] > 2 && (
                              <PaginationItem>
                                <PaginationEllipsis className="text-black/60" />
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {pageNumbers.map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                                currentPage === page 
                                  ? 'bg-black text-white hover:bg-black/90 border-black shadow-lg' 
                                  : 'text-black hover:text-black border-black/20 hover:bg-black/20 bg-black/10 backdrop-blur-sm'
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {pageNumbers[pageNumbers.length - 1] < totalPages && (
                          <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                              <PaginationItem>
                                <PaginationEllipsis className="text-black/60" />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink 
                                onClick={() => handlePageChange(totalPages)} 
                                className="cursor-pointer border-black/20 text-black hover:text-black hover:bg-black/20 bg-black/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem className="hidden sm:block">
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={`${
                              currentPage === totalPages 
                                ? 'pointer-events-none opacity-30 cursor-not-allowed' 
                                : 'cursor-pointer hover:scale-105'
                            } text-black hover:text-black border-black/20 hover:bg-black/20 bg-black/10 backdrop-blur-sm transition-all duration-300`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </PaginationComponent>
                  </div>
                </motion.div>
              )}

              {/* Mobile Pagination Buttons */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center gap-4 sm:hidden">
                  <button
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex-1 text-sm font-medium ${
                      currentPage === 1
                        ? 'opacity-30 cursor-not-allowed border-black/20 text-black bg-black/5'
                        : 'border-black/20 text-black hover:bg-black/20 bg-black/10 hover:scale-105 shadow-sm'
                    }`}
                  >
                    ކުރީގެ ޞަފްޙާ
                  </button>
                  
                  <div className="flex items-center px-4 py-3 rounded-2xl bg-black/10 backdrop-blur-sm border border-black/20 text-black text-sm font-medium shadow-sm">
                    <span className="whitespace-nowrap">{currentPage} / {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex-1 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'opacity-30 cursor-not-allowed border-black/20 text-black bg-black/5'
                        : 'border-black/20 text-black hover:bg-black/20 bg-black/10 hover:scale-105 shadow-sm'
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