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

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

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
    setCurrentPage(1); // Reset to first page when category changes
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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Categories Sidebar */}
      <div className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-right text-gray-900 font-faseyha">
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

      {/* Blog Grid */}
      <div className="flex-1">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse shadow-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 font-faseyha">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog._id}`} className="block group">
                <article className="relative h-48 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-200">
                  <div className="p-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold mb-2 text-right text-gray-900 line-clamp-2 font-faseyha">
                      {blog.title}
                    </h2>
                    <div className="text-gray-500 text-xs text-right mb-2">
                      {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                    </div>
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end mb-2">
                        {blog.categories.map((category: Category) => (
                          <span
                            key={category._id}
                            className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div
                      className="mt-auto text-right text-gray-600 line-clamp-2 text-sm font-faseyha"
                      style={{
                        fontSize:
                          blog.fontSize === 'small'
                            ? '0.875rem'
                            : blog.fontSize === 'large'
                            ? '1.125rem'
                            : '1rem',
                      }}
                      dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) + '...' }}
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
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
                      <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">1</PaginationLink>
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
      </div>
    </div>
  );
}