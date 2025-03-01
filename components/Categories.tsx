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
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-emerald-100/50 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <select
        value={selectedCategory || ''}
        onChange={(e) => onSelectCategory(e.target.value || null)}
        className="w-full p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-faseyha text-right shadow-sm transition-all duration-200"
      >
        <option value="" className="bg-white">އެންމެހާ ލިޔުންތައް</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id} className="bg-white">
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
            ? 'bg-emerald-100 text-emerald-800 shadow-md border border-emerald-200'
            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 hover:shadow-md'
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
              ? 'bg-emerald-100 text-emerald-800 shadow-md border border-emerald-200'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 hover:shadow-md'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}