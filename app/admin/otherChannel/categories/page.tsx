/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const response = await fetch('/api/otherCategories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error:', error);
      setError('ކެޓަގަރީތައް ލޯޑެއް ނުވި');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('ކެޓަގަރީގެ ނަން އެންގިފައި ނެތީ');
      return;
    }

    try {
      const response = await fetch('/api/otherCategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const data = await response.json();
      setCategories([...categories, data.category]);
      setNewCategory('');
      setError(null);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message === 'E11000 duplicate key error' ? 
        'މި ނަމާއި އެއްފަދަ ކެޓަގަރީއެއް އެބައިނެވެ' : 
        'ކެޓަގަރީ އިތުރުކުރުން ފައިލްވެއްޖެ');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('މި ކެޓަގަރީ ޑިލީޓް ކުރަންވީތަ؟')) return;

    try {
      const response = await fetch(`/api/otherCategories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter(cat => cat._id !== categoryId));
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('ކެޓަގަރީ ޑިލީޓް ނުކުރެވުން');
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
    <div className="p-6 max-w-4xl mx-auto font-faseyha">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-right">ކެޓަގަރީތައް</h1>
        <Link
          href="/admin/otherChannel"
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
            className="flex-1 px-4 py-2 border rounded-md text-right"
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
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
              <span className="text-lg text-right">{category.name}</span>
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
        <p className="text-center text-gray-500 mt-4 ">
          އަދި ކެޓަގަރީއެއް ނެތް
        </p>
      )}
    </div>
  );
}