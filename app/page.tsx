import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import LatestFeed from '@/components/LatestFeed';



export default function Home() {


  return (
    <main className="min-h-screen bg-gray-100 font-faseyha">
      <Header />
      <Hero />
      <LatestFeed />
      <Footer />
    </main>
  );
}