// app/page.tsx
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import BlogPosts from '@/components/BlogPosts';
import Footer from '@/components/Footer';

export const revalidate = 0;

export default async function Home() {
 ;
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <Hero />
        <BlogPosts />
        <Footer />
      </main>
    );
  } 