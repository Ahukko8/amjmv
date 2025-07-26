"use client";

import Link from 'next/link';
import { Blog } from '@/types/blog';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen} from 'lucide-react';

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
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
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Latest Blogs Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 mx-4" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 font-headingDhivehi mb-4">
              އެންމެ ފަހުގެ ލިޔުންތައް
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-faseyha leading-relaxed">
              އެންމެ ފަހުގެ ލިޔުންތައް މިތަނުން ބައްލަވާ
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 backdrop-blur-sm bg-black/5 border border-black/10 rounded-2xl animate-pulse shadow-lg" />
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
                <motion.div key={blog._id} variants={scaleIn}>
                  <Link href={`/blog/${blog._id}`} className="block group">
                    <article className="h-full backdrop-blur-lg bg-white/90 border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 group-hover:bg-white group-hover:border-gray-300 group-hover:scale-105 group-hover:shadow-2xl shadow-lg">
                      {/* Background image with overlay */}
                      <div 
                        className="relative h-48 sm:h-52 overflow-hidden"
                        style={{
                          backgroundImage: blog.image ? `url(${blog.image})` : 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                        
                        {/* Date badge */}
                        <div className="absolute top-4 right-4 backdrop-blur-sm bg-white/90 border border-gray-200 rounded-full px-3 py-1 shadow-md">
                          <span className="text-gray-700 text-sm font-medium font-faseyha mr-2">
                            އިތުރަށް ބަލާ
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col justify-between h-48">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right line-clamp-2 font-faseyha mb-3 group-hover:text-gray-800 transition-colors duration-300">
                            {blog.title}
                          </h3>
                          <div
                            className="text-gray-600 text-sm sm:text-base text-right line-clamp-3 font-faseyha leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 120) + '...' }}
                          />
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
            className="mt-12 sm:mt-16 text-center"
          >
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl font-faseyha shadow-lg"
            >
              ހުރިހާ ލިޔުންތައް
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest PDFs Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
              <Download className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 mx-4" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 font-headingDhivehi mb-4">
              އެންމެ ފަހުގެ ޕީ.ޑީ.އެފް
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-faseyha leading-relaxed">
              އެންމެ ފަހުގެ ޕީޑީއެފް ފައިލްތައް 
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 backdrop-blur-sm bg-black/5 border border-black/10 rounded-2xl animate-pulse shadow-lg" />
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
                <motion.div key={pdf._id} variants={scaleIn}>
                  <Link href={`/pdfs/${pdf._id}`} className="block group">
                    <article className="h-full backdrop-blur-lg bg-white/90 border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 group-hover:bg-white group-hover:border-gray-300 group-hover:scale-105 group-hover:shadow-2xl shadow-lg">
                      {pdf.image ? (
                        <div className="relative h-48 sm:h-52 overflow-hidden">
                          <Image
                            src={pdf.image}
                            alt={pdf.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                          
                          {/* PDF indicator */}
                          <div className="absolute top-4 right-4 backdrop-blur-sm  border border-gray-400/50 rounded-full px-3 py-1 shadow-md">
                            <span className="text-white text-xs font-medium"><Download className="size-5" /></span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"></div>
                      )}

                      <div className="p-6 flex flex-col justify-between h-48">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right line-clamp-2 font-faseyha mb-3 group-hover:text-gray-800 transition-colors duration-300">
                            {pdf.title}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base text-right line-clamp-3 font-faseyha leading-relaxed">
                            {pdf.description || 'ތަފްޞީލެއް ނެތް'}
                          </p>
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
            className="mt-12 sm:mt-16 text-center"
          >
            <Link
              href="/pdfs"
              className="inline-flex items-center justify-center px-8 py-4 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl font-faseyha shadow-lg"
            >
              ހުރިހާ ޕީ.ޑީ.އެފް
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LatestFeed;