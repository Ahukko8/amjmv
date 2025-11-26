"use client";

import Link from 'next/link';
import NextImage from 'next/image';
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
import OtherCategories from './OtherCategories';
import { useAllOtherPdfs } from '@/hooks/useAllOtherPdfs';

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 10;

export default function OtherPdfList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { pdfs, total, isLoading, error } = useAllOtherPdfs({
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
      {/* Categories Section */}
      <div className="w-full lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-right text-[#121212] font-faseyha">
            ޗެނަލްތައް
          </h3>
          {/* Mobile Categories */}
          <div className="block lg:hidden mb-6">
            <OtherCategories
              onSelectCategory={handleCategorySelect}
              selectedCategory={selectedCategory}
              isMobile={true}
            />
          </div>
          {/* Desktop Categories */}
          <div className="hidden lg:block">
            <OtherCategories
              onSelectCategory={handleCategorySelect}
              selectedCategory={selectedCategory}
              isMobile={false}
            />
          </div>
        </div>
      </div>

      {/* PDFs Grid Section */}
      <div className="flex-1 min-w-0 w-full lg:w-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-56 sm:h-64 bg-[#121212] rounded-xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10 sm:py-12 font-faseyha text-base sm:text-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.isArray(pdfs) && pdfs.length > 0 ? (
              pdfs.map((pdf) => (
                <Link key={pdf._id} href={`/otherChannel/pdf/${pdf._id}`} className="block group w-full">
                  <article
                    className="bg-[#121212] rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-emerald-100 h-full min-h-[14rem] sm:min-h-[16rem] relative"
                  >
                    {pdf.image && (
                      <div className="absolute inset-0 z-0">
                        <NextImage
                          src={pdf.image}
                          alt={pdf.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-[#121212]/60 z-10" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5 flex flex-col h-full relative z-20 min-h-[14rem] sm:min-h-[16rem]">
                      <h3 className="text-base sm:text-lg font-semibold text-right text-white line-clamp-2 font-faseyha leading-tight">
                        {pdf.title}
                      </h3>
                      <div className="text-white text-xs sm:text-sm text-right mt-2 opacity-90">
                        {new Date(pdf.createdAt).toLocaleDateString('dv-MV')}
                      </div>
                      <div
                        className="mt-3 text-right text-white line-clamp-3 text-sm sm:text-base font-faseyha opacity-90 flex-1"
                        dangerouslySetInnerHTML={{
                          __html: (pdf.content ? pdf.content.slice(0, 100) : 'No content available') + '...',
                        }}
                      />
                      <div className="mt-auto pt-3 text-right">
                        <span className="text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 px-3 py-1 rounded-full">
                          ކިޔާ
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 py-10 sm:py-12 font-faseyha text-base sm:text-lg">
                ޕީ.ޑީ.އެފް އެއް ނެތް
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center w-full">
            <PaginationComponent>
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={`${currentPage === 1
                      ? 'pointer-events-none opacity-50 cursor-not-allowed'
                      : 'cursor-pointer text-[#121212] hover:text-[#121212]/80 hover:bg-[#121212]/10'
                      } text-sm`}
                  />
                </PaginationItem>

                {pageNumbers[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer text-[#121212] hover:text-[#121212]/80 hover:bg-[#121212]/10 text-sm"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#121212] text-sm" />
                      </PaginationItem>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer text-sm ${currentPage === page
                        ? 'bg-[#121212] text-white hover:bg-[#121212]/90'
                        : 'text-[#121212] hover:text-[#121212]/80 hover:bg-[#121212]/10'
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
                        <PaginationEllipsis className="text-[#121212] text-sm" />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer text-[#121212] hover:text-[#121212]/80 hover:bg-[#121212]/10 text-sm"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={`${currentPage === totalPages
                      ? 'pointer-events-none opacity-50 cursor-not-allowed'
                      : 'cursor-pointer text-[#121212] hover:text-[#121212]/80 hover:bg-[#121212]/10'
                      } text-sm`}
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