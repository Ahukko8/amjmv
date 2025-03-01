import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import LatestFeed from '@/components/LatestFeed';
import Intro from '@/components/Intro';


export default function Home() {


  return (
    <main className="min-h-screen bg-gray-100 font-faseyha">
      <Header />
      <Hero />
      <Intro />
      <LatestFeed />
      <Footer />
    </main>
  );
}