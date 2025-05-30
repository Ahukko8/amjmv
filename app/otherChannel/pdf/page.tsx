"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import OtherPdfList from '@/components/OtherPDFlist';
import React from 'react'


export default function OtherPDFsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-faseyha">
      <Header />
      <section className="relative py-16 sm:py-20 md:py-24 text-[#F5F5F5]">
      <div className="absolute inset-0">
        <Image
          src="/images/other.jpg" 
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
        <div className="absolute inset-0 bg-[#121212]/60 z-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <h1 className="text-4xl text-[#F5F5F5] sm:text-5xl md:text-6xl font-bold font-faseyha mb-6 sm:mb-8 md:mb-10">
           އެހެން ޗެނަލްތަކުގެ ޕީ.ޑީ.އެފް
        </h1>
      </div>
    </section>
    <section className="flex-grow py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OtherPdfList />
      </div>
    </section>
    <Footer />
  </div>
  );
}
