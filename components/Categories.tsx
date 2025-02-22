// components/Categories.tsx
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
}

export default function Categories({ onSelectCategory, selectedCategory }: CategoriesProps) {
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
      <div className="animate-pulse space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-right px-4 py-2 rounded-lg font-faseyha transition-colors ${
          !selectedCategory 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'hover:bg-gray-50'
        }`}
      >
        އެންމެހާ ލިޔުންތައް
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`w-full text-right px-4 py-2 rounded-lg font-faseyha transition-colors ${
            selectedCategory === category._id 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'hover:bg-gray-50'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}