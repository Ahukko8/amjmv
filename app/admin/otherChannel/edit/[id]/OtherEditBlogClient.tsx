"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import OtherChannelBlogEditor from '@/components/OtherChannelBlogEditor';

interface BlogData {
  title: string;
  content: string;
  categories: string[];
  image?: File | string | null;
  fontFamily?: string;
  fontSize?: string;
}

interface BlogEditProps {
  params: Promise<{ id: string }>;
}

export default function OtherBlogEdit({ params }: BlogEditProps) {
  const [id, setId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{ 
    title?: string; 
    content?: string; 
    categories?: string[];
    image?: string;
    fontFamily?: string;
    fontSize?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap params safely with error handling
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        console.log('Resolved params:', resolvedParams);
        setId(resolvedParams.id);
      } catch (err) {
        console.error('Error unwrapping params:', err);
        setError('Failed to load blog ID');
      }
    };
    unwrapParams();
  }, [params]);

  // Fetch blog data once ID is available
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/otherChannelBlogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        
        const data = await response.json();
        console.log('Fetched blog data:', data);
        
        // Check if data.otherBlog exists before accessing properties
        if (!data.otherBlog) {
          throw new Error('Blog data not found in response');
        }
        
        setInitialData({
          title: data.otherBlog.title,
          content: data.otherBlog.content,
          categories: data.otherBlog.categories.map((cat: { _id: string }) => cat._id),
          image: data.otherBlog.image,
          fontFamily: data.otherBlog.fontFamily,
          fontSize: data.otherBlog.fontSize
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog details');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleSubmit = async (blogData: BlogData) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('categories', JSON.stringify(blogData.categories));
      
      // Add font family and size if they exist
      if (blogData.fontFamily) {
        formData.append('fontFamily', blogData.fontFamily);
      }
      
      if (blogData.fontSize) {
        formData.append('fontSize', blogData.fontSize);
      }
      
      if (blogData.image instanceof File) {
        formData.append('image', blogData.image);
      }

      const response = await fetch(`/api/otherChannelBlogs/${id}`, {
        method: 'PATCH',
        body: formData, // Use FormData instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }
      
      console.log('Blog update successful');
      router.push('/admin/otherChannel');
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12 font-faseyha text-red-500">
        {error}
      </div>
    );
  }

  if (loading || !id || !initialData) {
    return <Loading />
  }

  return (
    <div className="max-w-4xl mx-auto py-6 font-faseyha">
      <h1 className="text-2xl font-semibold mb-6 text-right">Edit Blog</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md text-right">
          {error}
        </div>
      )}
      {/* <BlogEditor 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      /> */}
      <OtherChannelBlogEditor    
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}