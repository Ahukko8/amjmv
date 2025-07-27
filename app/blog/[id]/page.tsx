import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import ClientReadingProgress from './ClientReadingProgress';
import { Suspense } from 'react';
import Footer from '@/components/Footer';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';

// Initialize DOMPurify with JSDOM
const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface BlogAuthor {
  _id: string;
  name: string;
}

interface BlogDocument {
  _id: string;
  title: string;
  content: string;
  author: BlogAuthor;
  status: 'draft' | 'published';
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage({ params }: PageProps) {
  const { id } = await params;

  try {
    await connectDB();
    
    const blog = await Blog.findOne({
      _id: id,
      status: 'published'
    })
    .populate('author', 'name')
    .lean<BlogDocument>();

    if (!blog) {
      return notFound();
    }

    const cleanHtml = purify.sanitize(blog.content, {
      ALLOWED_TAGS: [
        'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 
        'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'br',
        'div', 'span', 'img'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel', 'src', 'alt', 
        'class', 'id', 'style'
      ],
      ALLOW_DATA_ATTR: false,
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allowfullscreen', 'frameborder', 'sandbox'],
      FORBID_TAGS: ['script', 'style', 'form', 'input', 'textarea', 'select'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });

    const wordsPerMinute = 55;
    const wordCount = blog.content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return (
      <>
        <main className="min-h-screen mt-10 bg-gradient-to-br from-gray-50 via-white to-slate-50 font-faseyha relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>
          
          {/* Animated Background Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          <Header />
          
          {/* Reading Progress Bar */}
          <div className="sticky top-0 z-40 w-full">
            <Suspense fallback={<div className="h-1 bg-gray-200/50" />}>
              <ClientReadingProgress />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="relative z-10 py-8 sm:py-12 lg:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Go Back Button */}
              <div className="mb-8">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 text-gray-700 hover:text-gray-900 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-medium">ފަހަތަށް ދާން</span>
                </Link>
              </div>

              {/* Main Article Container */}
              <article className="relative">
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-white/40 rounded-3xl blur-2xl scale-105"></div>
                
                {/* Main Container */}
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 shadow-2xl overflow-hidden">
                  {/* Inner Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
                  
                  {/* Banner Image */}
                  {blog.image && (
                    <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={`${blog.title} banner`}
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={90}
                        className="transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="relative p-6 sm:p-8 lg:p-10">
                    
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-right mb-6 sm:mb-8 text-gray-900 break-words font-faseyha leading-tight">
                      {blog.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap justify-start items-center gap-4 sm:gap-6 text-gray-600 text-sm sm:text-base mb-8 sm:mb-10">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/40 shadow-sm">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <time className="font-medium">{new Date(blog.createdAt).toLocaleDateString('dv-MV')}</time>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/40 shadow-sm">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        <span className="font-medium">{readingTime} މިނިޓު</span>
                      </div>
                      {blog.author && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/40 shadow-sm">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                          <span className="font-medium">{blog.author.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent mb-8 sm:mb-10"></div>

                    {/* Content */}
                    <div 
                      className="prose prose-lg md:prose-xl max-w-none text-gray-800 break-words overflow-hidden font-faseyha text-justify leading-relaxed tracking-wide"
                      style={{ 
                        wordWrap: 'break-word',
                        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        lineHeight: '1.8'
                      }} 
                      dangerouslySetInnerHTML={{ __html: cleanHtml }} 
                    />

                    {/* Bottom Spacing */}
                    <div className="mt-12 sm:mt-16"></div>
                  </div>
                </div>
              </article>

              {/* Back to Blog Button - Bottom */}
              <div className="mt-12 text-center">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 text-gray-700 hover:text-gray-900 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-medium text-lg">އެހެން ލިޔުންތަކަށް ދާން</span>
                </Link>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </>
    );
  } catch (error) {
    console.error('Error loading blog:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    await connectDB();
    
    const blog = await Blog.findOne({
      _id: id,
      status: 'published'
    }).lean<BlogDocument>();

    if (!blog) {
      return {
        title: 'Blog Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const cleanContent = purify.sanitize(blog.content, { ALLOWED_TAGS: [] });
    const description = cleanContent.slice(0, 155) + '...';

    return {
      title: blog.title,
      description,
      openGraph: {
        title: blog.title,
        description,
        type: 'article',
        authors: [blog.author.name],
        publishedTime: new Date(blog.createdAt).toISOString(),
        modifiedTime: new Date(blog.updatedAt).toISOString(),
        images: blog.image ? [{ url: blog.image }] : undefined,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: 'Blog',
      description: 'Read our latest blog post',
    };
  }
}