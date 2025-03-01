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
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-100 rounded-xl w-1/3 sm:w-1/4 mb-8 sm:mb-12 ml-auto" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-emerald-50 rounded-xl shadow-sm" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {blogs.length > 0 ? (
          <BlogList /> // This now uses BlogCard internally
        ) : (
          <div className="text-center text-emerald-600 py-10 sm:py-12 font-faseyha text-base sm:text-lg">
            ލިޔުމެއް ނުފެނުނު
          </div>
        )}
      </div>
    </section>
  );
}