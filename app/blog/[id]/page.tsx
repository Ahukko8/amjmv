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

    // Sanitize the HTML content with specific allowed tags and attributes
    const cleanHtml = purify.sanitize(blog.content, {
      ALLOWED_TAGS: [
        'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 
        'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'br',
        'div', 'span', 'img'  // Add any other tags you need
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel', 'src', 'alt', 
        'class', 'id', 'style'  // Add any other attributes you need
      ],
      ALLOW_DATA_ATTR: false,
      ADD_TAGS: ['iframe'],  // Only if you need to embed content
      ADD_ATTR: ['allowfullscreen', 'frameborder', 'sandbox'],  // For iframes if needed
      FORBID_TAGS: ['script', 'style', 'form', 'input', 'textarea', 'select'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });

    const wordsPerMinute = 55;
    const wordCount = blog.content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return (
      <>
        
          <Header />
        
        
        <div className="top-0 z-50 w-full">
          <Suspense fallback={<div className="h-1 bg-gray-200" />}>
            <ClientReadingProgress />
          </Suspense>
        </div>

        <main className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-4xl font-bold text-right mb-6 text-gray-800 break-words font-faseyha">
                {blog.title}
              </h1>

              <div className="flex flex-wrap justify-start items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <time>{new Date(blog.createdAt).toLocaleDateString('dv-MV')}</time>
                </div>
                {/* <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{blog.author.name}</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  <span>{readingTime} މިނިޓު</span>
                </div>
              </div>

              <div 
                className="prose prose-lg md:prose-xl text-gray-800 mt-8 break-words overflow-hidden font-faseyha text-justify"
                style={{ 
                  maxWidth: '100%',
                  wordWrap: 'break-word'
                }} 
                dangerouslySetInnerHTML={{ __html: cleanHtml }} 
              />
            </div>
          </div>
        </main>

        <Footer/>
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

    // Sanitize the content for meta description
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