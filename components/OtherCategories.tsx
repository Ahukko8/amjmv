"use client";

import { otherCategory } from '@/types/otherCategory';
import { useEffect, useState } from 'react';

interface CategoriesProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  isMobile?: boolean;
}

export default function OtherCategories({ onSelectCategory, selectedCategory, isMobile = false }: CategoriesProps) {
  const [categories, setCategories] = useState<otherCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/otherCategories');
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <select
        value={selectedCategory || ''}
        onChange={(e) => onSelectCategory(e.target.value === '' ? null : e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 bg-white text-[#121212] text-sm sm:text-base focus:ring-2 focus:ring-[#121212] focus:border-[#121212] font-faseyha text-right shadow-sm transition-all duration-200"
      >
        <option value="" className="bg-white text-[#121212]">އެންމެހާ ލިޔުންތައް</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id} className="bg-white text-[#121212]">
            {category.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-right px-5 py-3 rounded-xl text-base font-medium font-faseyha transition-all duration-300 ${
          !selectedCategory
            ? 'bg-[#121212] text-white shadow-lg border border-[#121212]'
            : 'text-[#121212] bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
        }`}
      >
        އެންމެހާ ލިޔުންތައް
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`w-full text-right px-5 py-3 rounded-xl text-base font-medium font-faseyha transition-all duration-300 ${
            selectedCategory === category._id
              ? 'bg-[#121212] text-white shadow-lg border border-[#121212]'
              : 'text-[#121212] bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}