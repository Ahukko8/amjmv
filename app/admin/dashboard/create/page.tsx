/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/dashboard/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';

export default function CreateBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (blogData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Blog</h1>
      <BlogEditor onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}