"use client";

import Link from 'next/link';
import { Blog } from '@/types/blog';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PDF {
  _id: string;
  title: string;
  description?: string;
  pdfFile: string;
  image?: string;
  author: { name: string };
  createdAt: string;
}

const LatestFeed = () => {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [latestPDFs, setLatestPDFs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants for scroll
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

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
    <>
      {/* Latest Blogs Section */}
      <section className="py-12 sm:py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#121212] font-headingDhivehi">
              އެންމެ ފަހުގެ ލިޔުންތައް
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-[#121212] max-w-3xl mx-auto font-faseyha">
              އެންމެ ފަހުގެ ލިޔުންތައް މިތަނުން ބައްލަވާ
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-[#F5F5F5] rounded-xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerChildren}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {latestBlogs.map((blog) => (
                <motion.div key={blog._id} variants={fadeInUp}>
                  <Link href={`/blog/${blog._id}`} className="block group">
                    <article 
                      className="bg-[#F5F5F5] rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-emerald-100 h-full"
                      style={{
                        backgroundImage: blog.image ? `url(${blog.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="p-5 flex flex-col h-full bg-[#121212]/40"> {/* Overlay for readability */}
                        <h3 className="text-base sm:text-lg font-semibold text-right text-[#F5F5F5] line-clamp-2 font-faseyha">
                          {blog.title}
                        </h3>
                        <div className="text-[#F5F5F5] text-xs sm:text-sm text-right mt-2">
                          {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                        </div>
                        <div
                          className="mt-3 text-right text-[#F5F5F5] line-clamp-2 text-sm sm:text-base font-faseyha"
                          dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) + '...' }}
                        />
                        <div className="mt-auto text-right">
                          <span className="text-[#F5F5F5] text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            އިތުރަށް ބަލާ
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mt-10 sm:mt-14 text-center"
          >
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-[#121212] text-[#F5F5F5] text-sm sm:text-base font-medium rounded-lg shadow-md hover:bg-[#121212]/80 transition-all duration-300 font-faseyha"
            >
              ހުރިހާ ލިޔުންތައް
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest PDFs Section */}
      <section className="py-12 sm:py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#121212] font-headingDhivehi">
              އެންމެ ފަހުގެ ޕީ.ޑީ.އެފް
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-[#121212] max-w-3xl mx-auto font-faseyha">
              އެންމެ ފަހުގެ ޕީޑީއެފް ފައިލްތަކާއި ލިޔުންތައް ޑައުންލޯޑްކުރައްވާ
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-[#121212] rounded-xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerChildren}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {latestPDFs.map((pdf) => (
                <motion.div key={pdf._id} variants={fadeInUp}>
                  <Link href={`/pdfs/${pdf._id}`} className="block group">
                    <article className="bg-[#121212] rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-[#F5F5F5] h-full">
                      {pdf.image && (
                        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                          <Image
                            src={pdf.image}
                            alt={pdf.title}
                            fill
                            className="object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-[#121212]/10 group-hover:bg-[#121212]/20 transition-all duration-300"></div>
                        </div>
                      )}
                      <div className="p-5 flex flex-col h-full">
                        <h3 className="text-base sm:text-lg font-semibold text-right text-[#F5F5F5] line-clamp-2 font-faseyha">
                          {pdf.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-[#F5F5F5] text-right line-clamp-2 font-faseyha">
                          {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                        </p>
                        <div className="mt-auto text-right">
                          <span className="text-[#F5F5F5] text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            ޑައުންލޯޑް ކުރޭ
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mt-10 sm:mt-14 text-center"
          >
            <Link
              href="/pdfs"
              className="inline-block px-6 py-3 bg-[#121212] text-[#F5F5F5] text-sm sm:text-base font-medium rounded-lg shadow-md hover:bg-[#121212]/80 transition-all duration-300 font-faseyha"
            >
          ހުރިހާ ޕީ.ޑީ.އެފް
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LatestFeed;