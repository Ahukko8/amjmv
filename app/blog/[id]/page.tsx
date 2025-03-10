import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { Clock, Calendar } from 'lucide-react';
import ClientReadingProgress from './ClientReadingProgress';
import { Suspense } from 'react';
import Footer from '@/components/Footer';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Header from '@/components/Header';
import Image from 'next/image';

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
      <div className="flex flex-col min-h-screen bg-emerald-50 font-faseyha">
        <Header />
        
        <div className="top-0 z-50 w-full">
          <Suspense fallback={<div className="h-1 bg-gray-200" />}>
            <ClientReadingProgress />
          </Suspense>
        </div>

        <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              {/* Banner Image at Top */}
              {blog.image && (
                <div className="relative h-56 sm:h-72 md:h-96 w-full">
                  <Image
                    src={blog.image}
                    alt={`${blog.title} banner`}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    className="z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent z-10" />
                </div>
              )}

              {/* Content Area */}
              <div className="p-6 sm:p-8">
                {/* Title Below Image */}
                <h1 className="text-xl sm:text-xl md:text-5xl font-bold text-right mb-6 sm:mb-8 text-gray-900 break-words font-faseyha leading-tight">
                  {blog.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap justify-start items-center gap-4 sm:gap-6 text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <time>{new Date(blog.createdAt).toLocaleDateString('dv-MV')}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    <span>{readingTime} މިނިޓު</span>
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg md:prose-xl text-gray-800 break-words overflow-hidden font-faseyha text-justify leading-relaxed tracking-wide"
                  style={{ 
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }} 
                  dangerouslySetInnerHTML={{ __html: cleanHtml }} 
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
        </div>
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