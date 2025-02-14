"use client";

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import 'tailwindcss/tailwind.css';
import { yourFont } from '@/app/fonts';

interface BlogData {
    title: string;
    content: string;
  }
// Maintaining the same interface as your original code
interface BlogEditorProps {
    initialData?: BlogData;
    onSubmit: (data: BlogData) => void;  // Now properly typed
    loading?: boolean;
  }

// Keeping your original font options
// const fontFamilies = [
//     'IBM Plex Sans Arabic',
//     'Noto Sans Arabic',
//     'faseyha',
//     yourFont,
//   ] as const; 


export default function BlogEditor({ initialData, onSubmit, loading }: BlogEditorProps) {
  // State management remains the same
  const [title, setTitle] = useState(initialData?.title || '');

  // Initialize TipTap editor with similar functionality to React Quill
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `font-family: ${yourFont}`,
      },
    },
  });

  // Maintain the same form submission logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const blogData: BlogData = {
        title,
        content: editor.getHTML(),
      };
    
      onSubmit(blogData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-700">ސުރުޙީ</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">މައިގަނޑު</label>
        <div className="mt-1">
          <EditorContent 
            editor={editor} 
            className='min-h-[200px] p-4 border rounded-md shadow-sm font-faseyha'
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'ސޭވްކުަރަނީ...' : 'ސޭވްކުރޭ'}
        </button>
      </div>
    </form>
  );
}