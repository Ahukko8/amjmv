"use client";

import { useEffect, useState } from 'react';

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

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <select
        value={selectedCategory || ''}
        onChange={(e) => onSelectCategory(e.target.value || null)}
        className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-faseyha text-right"
      >
        <option value="">އެންމެހާ ލިޔުންތައް</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-right px-4 py-2 rounded-xl text-sm sm:text-base font-medium font-faseyha transition-all duration-200 ${
          !selectedCategory
            ? 'bg-indigo-100 text-indigo-700 shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
        }`}
      >
        އެންމެހާ ލިޔުންތައް
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`w-full text-right px-4 py-2 rounded-xl text-sm sm:text-base font-medium font-faseyha transition-all duration-200 ${
            selectedCategory === category._id
              ? 'bg-indigo-100 text-indigo-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}