"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import React from 'react';

interface BlogEditProps {
  params: Promise<{ id: string }>;
}

export default function BlogEdit({ params }: BlogEditProps) {
  const [id, setId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{ title?: string; content?: string; categories?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap params safely with error handling
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        console.log('Resolved params:', resolvedParams); // Debug params
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
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        console.log('Fetched blog data:', data); // Debug data
        setInitialData({
          title: data.blog.title,
          content: data.blog.content,
          categories: data.blog.categories.map((cat: { _id: string }) => cat._id),
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog details');
        router.push('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleSubmit = async (blogData: { title: string; content: string; categories: string[] }) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogData.title,
          content: blogData.content,
          categories: blogData.categories,
        }),
      });

      if (!response.ok) throw new Error('Failed to update blog');
      console.log('Blog update successful'); // Debug success
      router.push('/admin/dashboard');
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

  if (!id || !initialData) {
    return <div className="text-center py-12 font-faseyha">ލޯޑިން...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 font-faseyha">
      <h1 className="text-2xl font-semibold mb-6 text-right">Edit Blog</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md text-right">
          {error}
        </div>
      )}
      <BlogEditor initialData={initialData} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}