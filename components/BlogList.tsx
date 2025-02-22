"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Blog } from '@/types/blog';
import Categories from './Categories';

interface Category {
  _id: string;
  name: string;
}

interface BlogListProps {
  blogs: Blog[];
}

const cardStyles = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 via-teal-500 to-green-500',
  'bg-gradient-to-br from-violet-500 via-rose-500 to-red-500',
];

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 5; // Show 5 page numbers max, with ellipsis

export default function BlogList({ blogs: initialBlogs }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [totalBlogs, setTotalBlogs] = useState(initialBlogs.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBlogs(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const fetchBlogs = async (page: number, categoryId: string | null) => {
    setIsLoading(true);
    try {
      const url = new URL('/api/blogs', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', ITEMS_PER_PAGE.toString());
      if (categoryId) url.searchParams.set('category', categoryId);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalBlogs(data.total); // Assuming API returns total count
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  // Calculate visible page numbers with ellipsis
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse shadow-md" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <Link key={blog._id} href={`/blog/${blog._id}`} className="block group">
                <article
                  className={`relative h-72 p-6 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 ${
                    cardStyles[index % cardStyles.length]
                  }`}
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay" />
                  <div className="relative z-10 flex flex-col h-full">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-right text-white line-clamp-2 font-faseyha">
                      {blog.title}
                    </h2>
                    <div className="text-white/80 text-sm text-right mb-4">
                      {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                    </div>
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end mb-4">
                        {blog.categories.map((category: Category) => (
                          <span
                            key={category._id}
                            className="px-2 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div
                      className="mt-auto text-right text-white/90 line-clamp-2 text-sm sm:text-base font-faseyha"
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

        {/* Pagination with Ellipsis */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationComponent>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {pageNumbers[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
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
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages && handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }
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