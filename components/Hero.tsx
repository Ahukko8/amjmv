"use client"
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Blog } from '@/types/blog';

interface HeroProps {
  onSearch: (blogs: Blog[]) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/blogs?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      onSearch(data.blogs);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white">
          <span className="text-indigo-400">الشَّيْخُ أَحْمَدُ مُوسَى جِبْرِيلَ حَفِظَهُ اللَّهُ</span>
        </h1>
        <p className="text-lg text-gray-300 mb-12 text-center font-faseyha">
          އެންމެ ފަހުގެ ލިޔުންތައް މިތަނުން 
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ބުލޮގް ހޯދާ..."
              className="w-full py-4 px-6 pr-12 text-right rounded-2xl border-2 border-gray-700 bg-gray-800 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm transition-all duration-200 font-faseyha"
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors ${
                isSearching ? 'animate-pulse' : ''
              }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;