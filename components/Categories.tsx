"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoriesProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  isMobile?: boolean;
}

export default function Categories({ onSelectCategory, selectedCategory, isMobile = false }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside and handle scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDropdownOpen]);

  const handleCategorySelect = (categoryId: string | null) => {
    onSelectCategory(categoryId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        right: window.innerWidth - rect.right
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return 'އެންމެހާ ލިޔުންތައް';
    const category = categories.find(cat => cat._id === selectedCategory);
    return category?.name || ' ކެޓަގަރީ ނަގާ';
  };

  if (loading) {
    return (
      <div>
        {/* Desktop Loading */}
        <div className="hidden md:block">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">ކެޓަގަރީތައް</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-24 bg-black/5 backdrop-blur-sm rounded-xl animate-pulse border border-black/10" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Loading */}
        <div className="block md:hidden">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold text-black mb-4 text-center"> ކެޓަގަރީ ނަގާ</h2>
            <div className="h-12 bg-black/5 backdrop-blur-sm rounded-xl animate-pulse border border-black/10" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div>
        {/* Mobile Dropdown */}
        <div className="block md:hidden">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6 relative z-[100]"
          >
            <h2 className="text-xl font-semibold text-black mb-4 text-center"> ކެޓަގަރީ ނަގާ</h2>
            
            <div className="relative z-[100]" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-full px-4 py-3 bg-black/10 backdrop-blur-sm rounded-xl border border-black/20 text-black text-sm font-medium flex items-center justify-between hover:bg-black/20 transition-all duration-300 shadow-sm relative z-[101]"
              >
                <span>{getSelectedCategoryName()}</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Portal-like dropdown using fixed positioning */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown content with fixed positioning */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed bg-white border border-black/20 shadow-2xl z-[999] max-h-80 overflow-hidden rounded-xl"
                    style={{ 
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      right: `${dropdownPosition.right}px`,
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        onClick={() => handleCategorySelect(null)}
                        className={`w-full px-4 py-3 text-sm font-medium text-right hover:bg-black/10 transition-all duration-200 border-b border-black/5 last:border-b-0 ${
                          !selectedCategory ? 'bg-black/15 text-black font-semibold' : 'text-black/80'
                        }`}
                      >
                        ހުރިހާ ލިޔުންތައް
                      </button>
                      
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleCategorySelect(category._id)}
                          className={`w-full px-4 py-3 text-sm font-medium text-right hover:bg-black/10 transition-all duration-200 border-b border-black/5 last:border-b-0 ${
                            selectedCategory === category._id ? 'bg-black/15 text-black font-semibold' : 'text-black/80'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Categories */}
      <div className="hidden md:block">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-black mb-4 text-center">ކެޓަގަރީތައް</h2>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="flex flex-wrap justify-center gap-3"
          >
            <motion.button
              variants={fadeInUp}
              onClick={() => handleCategorySelect(null)}
              className={`px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 text-sm font-medium hover:scale-105 shadow-sm ${
                !selectedCategory
                  ? 'bg-black text-white border-black shadow-lg'
                  : 'bg-black/10 text-black border-black/20 hover:bg-black/20'
              }`}
            >
              ހުރިހާ ލިޔުންތައް
            </motion.button>
            
            {categories.map((category) => (
              <motion.button
                key={category._id}
                variants={fadeInUp}
                onClick={() => handleCategorySelect(category._id)}
                className={`px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 text-sm font-medium hover:scale-105 shadow-sm ${
                  selectedCategory === category._id
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-black/10 text-black border-black/20 hover:bg-black/20'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}