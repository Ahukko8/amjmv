"use client"
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Image from 'next/image'
import OtherBloglist from '@/components/OtherBloglist'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] font-faseyha">
    <Header />
    {/* Banner with Image */}
    <section className="relative py-16 sm:py-20 md:py-24 text-[#F5F5F5]">
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/other.jpg" // Path relative to /public
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
        <div className="absolute inset-0 bg-[#121212]/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <h1 className="text-4xl text-[#F5F5F5] sm:text-5xl md:text-6xl font-bold font-faseyha mb-6 sm:mb-8 md:mb-10">
           އެހެން ޗެނަލްތަކުގެ ލިޔުންތައް
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section className="flex-grow py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OtherBloglist />
      </div>
    </section>

    {/* Footer */}
    <Footer />
  </div>
  )
}

export default page
