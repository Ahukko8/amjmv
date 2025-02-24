"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Link from 'next/link';
import { Blog } from '@/types/blog';
import Image from 'next/image';

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  createdAt: string;
}

export default function Home() {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [latestPDFs, setLatestPDFs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        // Fetch latest 4 blogs
        const blogResponse = await fetch('/api/blogs?page=1&limit=4');
        if (!blogResponse.ok) throw new Error('Failed to fetch blogs');
        const blogData = await blogResponse.json();
        setLatestBlogs(blogData.blogs);

        // Fetch latest 4 PDFs
        const pdfResponse = await fetch('/api/pdfs?page=1&limit=4');
        if (!pdfResponse.ok) throw new Error('Failed to fetch PDFs');
        const pdfData = await pdfResponse.json();
        setLatestPDFs(pdfData.pdfs);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 font-faseyha">
      <Header />
      <Hero />

      {/* Latest Blogs Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-right text-gray-900">
              އެންމެ ފަހުގެ ބުލޮގުތައް
            </h2>
            <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium">
              އިތުރު ފެންނަން
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse shadow-md" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestBlogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`} className="block group">
                  <article className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-right text-gray-900 line-clamp-2">
                        {blog.title}
                      </h3>
                      <div className="text-gray-500 text-sm text-right mt-2">
                        {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                      </div>
                      <div
                        className="mt-2 text-right text-gray-600 line-clamp-2 text-sm font-faseyha"
                        dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) + '...' }}
                      />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest PDFs Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-right text-gray-900">
              އެންމެ ފަހުގެ PDFs
            </h2>
            <Link href="/pdfs" className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium">
              އިތުރު ފެންނަން
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse shadow-md" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestPDFs.map((pdf) => (
                <Link key={pdf._id} href={`/pdfs/${pdf._id}`} className="block group">
                  <article className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    {pdf.image && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={pdf.image}
                          alt={pdf.title}
                          fill
                          className="object-cover rounded-t-md"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-right text-gray-900 line-clamp-2">
                        {pdf.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 text-right line-clamp-2">
                        {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}