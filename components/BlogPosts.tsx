// components/BlogPosts.tsx
"use client";

import { useEffect, useState } from 'react';
import { Blog } from '@/types/blog';
import BlogList from './BlogList';

interface BlogPostsProps {
  initialBlogs?: Blog[] | null;
}

export default function BlogPosts({ initialBlogs }: BlogPostsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(!initialBlogs);

  useEffect(() => {
    if (initialBlogs) {
      setBlogs(initialBlogs);
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [initialBlogs]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-b from-indigo-100 to-white rounded w-1/4 mb-12 ml-auto" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-right font-faseyha">
          {initialBlogs ? 'ހޯދުނު ނަތީޖާ' : 'އެންމެ ފަހުގެ ލިޔުންތައް'}
        </h2>
        {blogs.length > 0 ? (
          <BlogList blogs={blogs} />
        ) : (
          <div className="text-center text-gray-500 py-12 font-faseyha">
            ލިޔުމެއް ނުފެނުނު
          </div>
        )}
      </div>
    </section>
  );
}