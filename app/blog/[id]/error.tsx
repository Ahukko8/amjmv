// app/blog/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Error loading the blog post
          </h2>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}