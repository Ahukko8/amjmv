// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BlogList from '@/components/BlogList';
import Footer from '@/components/Footer';
import { Blog } from '@/types/blog';



export default function Home() {
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setLatestBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (blogs: Blog[]) => {
    setSearchResults(blogs);
    setHasSearched(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasSearched ? (
            <>
              <h2 className="text-3xl font-bold mb-12 text-right font-faseyha">
                ހޯދުނު ނަތީޖާ
              </h2>
              {searchResults.length > 0 ? (
                <BlogList blogs={searchResults} />
              ) : (
                <div className="text-center text-gray-500 py-12 font-faseyha">
                  ލިޔުމެއް ނުފެނުނު
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-12 text-right font-faseyha">
                އެންމެ ފަހުގެ ލިޔުންތައް
              </h2>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <BlogList blogs={latestBlogs} />
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

