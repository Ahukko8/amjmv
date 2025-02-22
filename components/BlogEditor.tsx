"use client";

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import 'tailwindcss/tailwind.css';
import { yourFont } from '@/app/fonts';
import { Category } from '@/types/category';

interface BlogData {
  title: string;
  content: string;
  categories: string[];
}

interface BlogEditorProps {
  initialData?: {
    title?: string;
    content?: string;
    categories?: string[];
  };
  onSubmit: (data: BlogData) => void;
  loading?: boolean;
}

export default function BlogEditor({ initialData, onSubmit, loading }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.categories?.[0] || '');
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[150px] sm:min-h-[200px]',
        style: `font-family: ${yourFont}`,
      },
    },
    immediatelyRender: false, // Explicitly disable immediate rendering for SSR compatibility
  });

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
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const blogData: BlogData = {
      title,
      content: editor.getHTML(),
      categories: selectedCategory ? [selectedCategory] : [],
    };
    
    onSubmit(blogData);
  };

  // Prevent rendering until the editor is initialized to avoid hydration issues
  if (!editor) {
    return null; // Or a loading spinner if preferred
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-base sm:text-lg font-medium text-gray-700">ސުރުޙީ</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full h-10 sm:h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">ކެޓަގަރީ</label>
        {categoriesLoading ? (
          <div className="text-gray-500 text-sm">Loading categories...</div>
        ) : (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full h-10 sm:h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="">ކެޓަގަރީއެއް ހޮވާ</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium text-gray-700">މައިގަނޑު</label>
        <div className="mt-1 border rounded-md shadow-sm">
          <EditorContent 
            editor={editor} 
            className="p-3 sm:p-4 font-faseyha"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          {loading ? 'ސޭވްކުަރަނީ...' : 'ސޭވްކުރޭ'}
        </button>
      </div>
    </form>
  );
}