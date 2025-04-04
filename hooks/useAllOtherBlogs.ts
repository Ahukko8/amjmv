"use client";

import { useState, useEffect } from 'react';
import { otherBlog } from '@/types/otherBlog';

interface FetchBlogsParams {
  page: number;
  limit: number;
  categoryId: string | null;
}

interface FetchBlogsResult {
  blogs: otherBlog[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export const useAllOtherBlogs = ({ page, limit, categoryId }: FetchBlogsParams): FetchBlogsResult => {
  const [blogs, setBlogs] = useState<otherBlog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('/api/otherChannelBlogs', window.location.origin);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', limit.toString());
        if (categoryId) url.searchParams.set('category', categoryId);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data.blogs);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [page, limit, categoryId]);

  return { blogs, total, isLoading, error };
};