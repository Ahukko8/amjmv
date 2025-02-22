"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';

interface BlogData {
  title: string;
  content: string;
  categories: string[];
}

export default function CreateBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (blogData: BlogData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: blogData.title,
          content: blogData.content,
          categories: blogData.categories
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Blog</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <BlogEditor onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}