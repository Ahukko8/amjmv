/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from 'next/link';
import { useState } from 'react';
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

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      <div className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-right text-[#121212] font-faseyha">
            ކެޓަގަރީތައް
          </h3>
          <div className="block lg:hidden mb-6">
            <Categories
              onSelectCategory={handleCategorySelect}
              selectedCategory={selectedCategory}
              isMobile={true}
            />
          </div>
          <div className="hidden lg:block">
            <Categories
              onSelectCategory={handleCategorySelect}
              selectedCategory={selectedCategory}
              isMobile={false}
            />
          </div>
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-56 sm:h-64 bg-[#121212] rounded-xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10 sm:py-12 font-faseyha text-base sm:text-lg">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog._id}`} className="block group">
                <article 
                  className="bg-[#121212] rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-emerald-100 h-full"
                  style={{
                    backgroundImage: blog.image ? `url(${blog.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="p-5 flex flex-col h-full bg-[#121212]/40">
                    <h3 className="text-base sm:text-lg font-semibold text-right text-white line-clamp-2 font-faseyha">
                      {blog.title}
                    </h3>
                    <div className="text-white text-xs sm:text-sm text-right mt-2">
                      {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                    </div>
                    <div
                      className="mt-3 text-right text-white line-clamp-2 text-sm sm:text-base font-faseyha"
                      dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) + '...' }}
                    />
                    <div className="mt-auto text-right">
                      <span className="text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ލިޔުން ކިޔާ
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <PaginationComponent>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer text-white hover:text-white/80'}
                  />
                </PaginationItem>

                {pageNumbers[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer text-white hover:text-white/80">1</PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && <PaginationItem><PaginationEllipsis className="text-white" /></PaginationItem>}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer ${currentPage === page ? 'bg-[#121212] text-white' : 'text-white hover:text-ehite/80'}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <PaginationItem><PaginationEllipsis className="text-white" /></PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer text-white hover:text-white/80">
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer text-white hover:text-white/80'}
                  />
                </PaginationItem>
              </PaginationContent>
            </PaginationComponent>
          </div>
        )}
      </div>
    </div>
  );
}