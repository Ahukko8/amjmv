"use client";

import { motion } from 'framer-motion';
import BlogList from '@/components/BlogList';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function BlogsPage() {

  const slideInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 font-faseyha relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      <Header />
      
      {/* Dark Glassmorphic Hero Section - Full Width */}
      <section className="relative">
        {/* Dark Background with Glassmorphic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative py-20 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInDown}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-4 mb-8 sm:mb-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-lg"></div>
                  <div className="relative p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent leading-tight"
              >
                ލިޔުންތައް
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-300 font-light leading-relaxed mb-12 sm:mb-16 lg:mb-20 px-4"
              >
                ދިވެހި ބަހަށް ތަރުޖަމާ ކުރެވިފައިވާ ލިޔުންތަކުގެ ކުލެކްޝަން
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section - Higher z-index to allow dropdown to appear above cards */}
      <section className="relative z-[200] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add your BlogCategories component here similar to PdfCategories */}
          {/* <BlogCategories 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          /> */}
        </div>
      </section>

      {/* Main Content Section - Lower z-index than categories */}
      <section className="relative z-10 py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="relative"
          >
            {/* BlogList Component - Direct rendering without card wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <BlogList />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}