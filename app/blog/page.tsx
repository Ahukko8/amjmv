"use client";

import BlogList from '@/components/BlogList';
import Footer from '@/components/Footer';
import Header from '@/components/Header';


export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-gray-50 font-faseyha">
    <Header />

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogList />
        </div>
      </section>

      {/* Custom Footer */}
   <Footer />
    </main>
  );
}