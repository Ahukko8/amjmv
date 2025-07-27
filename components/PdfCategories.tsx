/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Loading from './Loading';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function PdfCategories({ selectedCategory, onCategoryChange }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 5;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  // Close dropdown when clicking outside and handle scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDropdownOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
      setTotalCategories(data.total || 0);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setTotalCategories(0);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCategories / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 3;
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

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        right: window.innerWidth - rect.right
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'ހުރިހާ';
    const category = categories.find(cat => cat._id === selectedCategory);
    return category?.name || 'ކެޓަގަރީ ނަގާ';
  };

  return (
    <div className="mb-8">
      {/* Desktop Categories */}
      <div className="hidden md:block">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-black mb-4 text-center">ކެޓަގަރީތައް</h2>
          
          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-24 bg-black/5 backdrop-blur-sm rounded-xl animate-pulse border border-black/10" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="flex flex-wrap justify-center gap-3"
            >
              <motion.button
                variants={fadeInUp}
                onClick={() => handleCategorySelect('all')}
                className={`px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 text-sm font-medium hover:scale-105 shadow-sm ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-black/10 text-black border-black/20 hover:bg-black/20'
                }`}
              >
                ހުރިހާ
              </motion.button>
              
              {categories.map((category) => (
                <motion.button
                  key={category._id}
                  variants={fadeInUp}
                  onClick={() => handleCategorySelect(category._id)}
                  className={`px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 text-sm font-medium hover:scale-105 shadow-sm ${
                    selectedCategory === category._id
                      ? 'bg-black text-white border-black shadow-lg'
                      : 'bg-black/10 text-black border-black/20 hover:bg-black/20'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Desktop Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-center"
            >
              <div className="bg-black/5 backdrop-blur-xl rounded-xl border border-black/10 p-2 shadow-sm">
                <PaginationComponent>
                  <PaginationContent className="flex gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`text-xs ${
                          currentPage === 1 
                            ? 'pointer-events-none opacity-30 cursor-not-allowed' 
                            : 'cursor-pointer hover:scale-105'
                        } text-black hover:text-black border-black/20 hover:bg-black/20 bg-black/10 backdrop-blur-sm transition-all duration-300`}
                      />
                    </PaginationItem>

                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={`cursor-pointer transition-all duration-300 hover:scale-105 text-xs ${
                            currentPage === page 
                              ? 'bg-black text-white hover:bg-black/90 border-black shadow-lg' 
                              : 'text-black hover:text-black border-black/20 hover:bg-black/20 bg-black/10 backdrop-blur-sm'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={`text-xs ${
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
        </motion.div>
      </div>

      {/* Mobile Dropdown */}
      <div className="block md:hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6 relative z-[100]"
        >
          <h2 className="text-xl font-semibold text-black mb-4 text-center">ކެޓަގަރީ ނަގާ</h2>
          
          <div className="relative z-[100]" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-full px-4 py-3 bg-black/10 backdrop-blur-sm rounded-xl border border-black/20 text-black text-sm font-medium flex items-center justify-between hover:bg-black/20 transition-all duration-300 shadow-sm relative z-[101]"
            >
              <span>{getSelectedCategoryName()}</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Portal-like dropdown using fixed positioning */}
            {isDropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]"
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown content with fixed positioning */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="fixed bg-white border border-black/20 shadow-2xl z-[999] max-h-80 overflow-hidden rounded-xl"
                  style={{ 
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    right: `${dropdownPosition.right}px`,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
                  }}
                >
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className={`w-full px-4 py-3 text-sm font-medium text-right hover:bg-black/10 transition-all duration-200 border-b border-black/5 last:border-b-0 ${
                        selectedCategory === 'all' ? 'bg-black/15 text-black font-semibold' : 'text-black/80'
                      }`}
                    >
                      ހުރިހާ 
                    </button>
                    
                    {isLoading ? (
                      <div className="p-4 text-center text-black/60 text-sm">
                        <Loading />
                      </div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleCategorySelect(category._id)}
                          className={`w-full px-4 py-3 text-sm font-medium text-right hover:bg-black/10 transition-all duration-200 border-b border-black/5 last:border-b-0 ${
                            selectedCategory === category._id ? 'bg-black/15 text-black font-semibold' : 'text-black/80'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Mobile Categories Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-black/10 p-3 bg-black/5">
                      <div className="flex justify-between items-center gap-2">
                        <button
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                            currentPage === 1
                              ? 'opacity-30 cursor-not-allowed bg-black/5 text-black'
                              : 'bg-black/10 text-black hover:bg-black/20'
                          }`}
                        >
                          ކުރީގެ
                        </button>
                        
                        <span className="text-xs text-black/70 font-medium">
                          {currentPage} / {totalPages}
                        </span>
                        
                        <button
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                            currentPage === totalPages
                              ? 'opacity-30 cursor-not-allowed bg-black/5 text-black'
                              : 'bg-black/10 text-black hover:bg-black/20'
                          }`}
                        >
                          ދެން އޮތް
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}