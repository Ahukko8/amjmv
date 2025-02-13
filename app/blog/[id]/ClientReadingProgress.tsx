// app/blog/[id]/ClientReadingProgress.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ClientReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(scrollHeight > 0 ? (currentProgress / scrollHeight) * 100 : 0);
    };

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress();
    
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}