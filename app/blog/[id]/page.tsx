import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import ClientReadingProgress from './ClientReadingProgress';
import { Suspense } from 'react';
import Footer from '@/components/Footer';

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

    const wordsPerMinute = 200;
    const wordCount = blog.content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return (
      <>
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 shadow-lg">
          <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center text-white hover:opacity-80">
              <ArrowLeft className="w-5 h-5 mr-2" /> އަނބުރާ ދިއުން
            </Link>
            <h2 className="text-lg font-semibold">Dhivehi Blog</h2>
          </div>
        </header>
        
        <div className="top-0 z-50 w-full">
          <Suspense fallback={<div className="h-1 bg-gray-200" />}>
            <ClientReadingProgress />
          </Suspense>
        </div>

        <main className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-4xl font-bold text-right mb-6 text-gray-800 break-words" style={{ fontFamily: blog.fontFamily }}>
                {blog.title}
              </h1>

              <div className="flex flex-wrap justify-end items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <time>{new Date(blog.createdAt).toLocaleDateString('dv-MV')}</time>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{blog.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              <div 
                className="prose prose-lg md:prose-xl text-gray-800 mt-8 text-right break-words overflow-hidden"
                style={{ 
                  fontFamily: blog.fontFamily, 
                  fontSize: blog.fontSize === 'small' ? '0.875rem' : blog.fontSize === 'large' ? '1.125rem' : '1rem',
                  maxWidth: '100%',
                  wordWrap: 'break-word'
                }} 
                dangerouslySetInnerHTML={{ __html: blog.content }} 
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

    return {
      title: blog.title,
      description: blog.content.slice(0, 155) + '...',
      openGraph: {
        title: blog.title,
        description: blog.content.slice(0, 155) + '...',
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