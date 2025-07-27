/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from 'next/link';
import { useState } from 'react';
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
import Categories from './Categories';
import { useAllBlogs } from '@/hooks/useAllBlogs';

interface Category {
  _id: string;
  name: string;
}

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 10;

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { blogs, total, isLoading, error } = useAllBlogs({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    categoryId: selectedCategory,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    if (end - start + 1 < MAX_VISIBLE_PAGES) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-8">
      {/* Categories Section - No Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {/* Mobile Categories */}
        <div className="block md:hidden">
          <Categories
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
            isMobile={true}
          />
        </div>
        {/* Desktop Categories */}
        <div className="hidden md:block mt-[30px] mb-[90px]">
          <Categories
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
            isMobile={false}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100/50 backdrop-blur-sm rounded-2xl animate-pulse border border-gray-200/30 shadow-lg" />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-red-50/80 backdrop-blur-xl rounded-3xl border border-red-200/50 p-12 max-w-md mx-auto shadow-lg">
              <div className="p-4 rounded-2xl bg-red-100/50 backdrop-blur-sm w-fit mx-auto mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-red-800 mb-3 font-faseyha">ހަނދާންއެއް ދިމާވެއްޖެ</h3>
              <p className="text-red-700 leading-relaxed font-faseyha">{error}</p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {blogs.map((blog, index) => (
                <motion.div 
                  key={blog._id} 
                  variants={fadeInUp}
                  custom={index}
                  className="relative"
                >
                  <Link href={`/blog/${blog._id}`} className="block group h-full">
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 group-hover:bg-white/30 group-hover:-translate-y-3 border border-gray-200/30 group-hover:border-gray-300/50 h-full flex flex-col shadow-lg group-hover:shadow-2xl group-hover:shadow-gray-500/20 relative">
                      {blog.image ? (
                        <div className="relative h-48 w-full overflow-hidden">
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${blog.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                        </div>
                      ) : (
                        <div className="relative h-48 w-full bg-gradient-to-br from-gray-200/50 to-gray-100/30 flex items-center justify-center border-b border-gray-200/30">
                          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-right text-gray-800 line-clamp-2 leading-relaxed font-faseyha">
                            {blog.title}
                          </h3>
                          
                          <div className="text-gray-600 text-sm text-right mt-2 font-faseyha">
                            {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                          </div>
                          
                          <div
                            className="mt-3 text-right text-gray-700 line-clamp-3 text-sm leading-relaxed font-faseyha"
                            dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 120) + '...' }}
                          />
                        </div>
                        
                        <div className="mt-6 text-right">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl border border-gray-300/40 text-gray-700 text-sm group-hover:bg-gray-800 group-hover:text-white transition-all duration-300 shadow-sm font-faseyha">
                            <span>ލިޔުން ކިޔާ</span>
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
            {blogs.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-gray-50/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-12 max-w-md mx-auto shadow-lg">
                  <div className="p-4 rounded-2xl bg-gray-100/50 backdrop-blur-sm w-fit mx-auto mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 font-faseyha">ލިޔުންތަކެއް ނެތް</h3>
                  <p className="text-gray-600 leading-relaxed font-faseyha">މި ބާވަތުގައި ލިޔުންތަކެއް ނެތް، ފަހުން އަނބުރާ ވަޑައިގަންނަވާ</p>
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
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-4 shadow-lg">
                  <PaginationComponent>
                    <PaginationContent className="flex flex-wrap justify-center gap-2">
                      <PaginationItem className="hidden sm:block">
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={`${
                            currentPage === 1 
                              ? 'pointer-events-none opacity-30 cursor-not-allowed' 
                              : 'cursor-pointer hover:scale-105'
                          } text-gray-700 hover:text-gray-900 border-gray-300/40 hover:bg-gray-200/50 bg-white/40 backdrop-blur-sm transition-all duration-300`}
                        />
                      </PaginationItem>

                      {pageNumbers[0] > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => handlePageChange(1)} 
                              className="cursor-pointer border-gray-300/40 text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 bg-white/40 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {pageNumbers[0] > 2 && (
                            <PaginationItem>
                              <PaginationEllipsis className="text-gray-600" />
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
                                ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-800 shadow-lg' 
                                : 'text-gray-700 hover:text-gray-900 border-gray-300/40 hover:bg-gray-200/50 bg-white/40 backdrop-blur-sm'
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
                              <PaginationEllipsis className="text-gray-600" />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => handlePageChange(totalPages)} 
                              className="cursor-pointer border-gray-300/40 text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 bg-white/40 backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
                          } text-gray-700 hover:text-gray-900 border-gray-300/40 hover:bg-gray-200/50 bg-white/40 backdrop-blur-sm transition-all duration-300`}
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
                  className={`px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex-1 text-sm font-medium font-faseyha ${
                    currentPage === 1
                      ? 'opacity-30 cursor-not-allowed border-gray-300/40 text-gray-500 bg-white/30'
                      : 'border-gray-300/40 text-gray-700 hover:bg-gray-200/50 bg-white/40 hover:scale-105 shadow-sm'
                  }`}
                >
                  ކުރީގެ ޞަފްޙާ
                </button>
                
                <div className="flex items-center px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-gray-300/40 text-gray-700 text-sm font-medium shadow-sm font-faseyha">
                  <span className="whitespace-nowrap">{currentPage} / {totalPages}</span>
                </div>
                
                <button
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex-1 text-sm font-medium font-faseyha ${
                    currentPage === totalPages
                      ? 'opacity-30 cursor-not-allowed border-gray-300/40 text-gray-500 bg-white/30'
                      : 'border-gray-300/40 text-gray-700 hover:bg-gray-200/50 bg-white/40 hover:scale-105 shadow-sm'
                  }`}
                >
                  ދެން އޮތް ޞަފްޙާ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}