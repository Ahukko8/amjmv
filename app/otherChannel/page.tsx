"use client";

import { SetStateAction, useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OtherBloglist from '@/components/OtherBloglist';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OtherChannelPage() {
  // Get the current view from URL params or default to "blogs"
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'blogs');

  const handleViewChange = (view: SetStateAction<string>) => {
    setActiveView(view);
    router.push(`?view=${view}`, { scroll: false });
  };

  return (
    <div className="font-faseyha flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

       {/* Banner with Image */}
       <div className="relative w-full h-64 md:h-80">
        {/* Image */}
        <Image
          src="/images/other.jpg"
          alt="Channel Banner"
          fill
            style={{ objectFit: 'cover' }}
            quality={85}
            priority
            className="z-0"
            onError={(e) => {
              console.error('Failed to load banner image:', e);
            }}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            އެހެން ޗެނަލްތައް
          </h1>

          <p className="text-white text-lg md:text-xl max-w-3xl">
            ޓެލެގްރާމް ޗެނަލްތަކުގެ ތެރެއިން ހޮވާލެވިފައިވާ ބައެއް މުހިންމު ޗެނަލްތަކުގެ ލިޔުންތައް
          </p>
        </div>
      </div>

      {/* Simple Toggle Buttons */}
      <div className="container mx-auto mt-4 mb-2 flex justify-center">
        <button
          onClick={() => handleViewChange('blogs')}
          className={`px-6 py-2 mx-2 rounded-md transition-colors ${
            activeView === "blogs"
              ? 'bg-[#F5F5F5]/40 text-[#121212] shadow-md border border-[#121212]/20'
              : 'text-[#121212] bg-[#F5F5F5] hover:[#F5F5F5]/20 hover:text-[#121212]/80 hover:shadow-md border border-[#121212]/10'
            }`}
        >
          ލިޔުންތައް
        </button>
        <button
          onClick={() => handleViewChange('pdfs')}
          className={`px-6 py-2 mx-2 rounded-md transition-colors ${
            activeView === 'pdfs'
            ? 'bg-[#F5F5F5]/40 text-[#121212] shadow-md border border-[#121212]/20'
            : 'text-[#121212] bg-[#F5F5F5] hover:[#F5F5F5]/20 hover:text-[#121212]/80 hover:shadow-md border border-[#121212]/10'
          }`}
        >
          ޕީ.ޑީ.އެފް
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto py-6 px-4">
        {activeView === 'blogs' ? (
          <OtherBloglist />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PDF content would go here */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Sample PDF 1</h3>
              <p className="text-gray-600 mb-4">Description of the PDF document</p>
              <a 
                href="#" 
                className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Download PDF
              </a>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Sample PDF 2</h3>
              <p className="text-gray-600 mb-4">Description of the PDF document</p>
              <a 
                href="#" 
                className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Download PDF
              </a>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Sample PDF 3</h3>
              <p className="text-gray-600 mb-4">Description of the PDF document</p>
              <a 
                href="#" 
                className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}