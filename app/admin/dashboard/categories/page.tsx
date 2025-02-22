"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      const data = await response.json();
      setCategories([...categories, data.category]);
      setNewCategory('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create category');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('މި ކެޓަގަރީ ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">ކެޓަގަރީތައް</h1>
        <Link
          href="/admin/dashboard"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          އަނބުރާ
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="އާ ކެޓަގަރީގެ ނަން"
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            އިތުރުކުރޭ
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <span className="text-lg">{category.name}</span>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md"
              >
                ޑިލީޓް
              </button>
            </li>
          ))}
        </ul>
      </div>

      {categories.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          އަދި ކެޓަގަރީއެއް ނެތް
        </p>
      )}
    </div>
  );
}