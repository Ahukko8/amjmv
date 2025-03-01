"use client";

import Image from 'next/image';
import BlogList from '@/components/BlogList';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-emerald-50 font-faseyha">
      {/* Header */}
      <Header />

      {/* Banner with Image */}
      <section className="relative py-16 sm:py-20 md:py-24 text-white">
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/blogImg.jpg" // Path relative to /public
            alt="Blog Banner"
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
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-faseyha mb-6 sm:mb-8 md:mb-10">
             ލިޔުންތައް
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            ދިވެހި ބަހަށް ތަރުޖަމާ ކުރެވިފައިވާ ލިޔުންތައް
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogList />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}