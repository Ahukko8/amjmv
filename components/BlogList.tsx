// components/BlogList.tsx
import Link from 'next/link';
import { useState } from 'react';
import { Blog } from '@/types/blog';
import Categories from './Categories';

// Define the Category type to match the structure used in the component
interface Category {
  _id: string;
  name: string;
}

interface BlogListProps {
  blogs: Blog[];
}

const cardStyles = [
  'bg-gradient-to-r from-violet-600 to-indigo-600',
  'bg-gradient-to-r from-blue-600 to-violet-600',
  'bg-gradient-to-r from-indigo-600 to-purple-600',
];

export default function BlogList({ blogs: initialBlogs }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setFilteredBlogs(initialBlogs.filter(blog => 
        blog.categories?.some((cat: Category) => cat._id === categoryId)
      ));
    } else {
      setFilteredBlogs(initialBlogs);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Categories Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-6">
          <h3 className="text-xl font-bold mb-6 text-right font-faseyha">
            ކެޓަގަރީތައް
          </h3>
          <Categories 
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="flex-1">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 font-faseyha">
          {filteredBlogs.map((blog, index) => (
            <Link
              key={blog._id}
              href={`/blog/${blog._id}`}
              className="block group"
            >
              <article 
                className={`h-full p-6 rounded-xl relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 ${
                  cardStyles[index % cardStyles.length]
                }`}
              >
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-soft-light" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-3 text-right font-faseyha text-white">
                    {blog.title}
                  </h2>
                  
                  <div className="text-white/80 text-sm text-right mb-4">
                    {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
                  </div>

                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end mb-4">
                      {blog.categories.map((category: Category) => (
                        <span
                          key={category._id}
                          className="px-2 py-1 rounded-full bg-white/10 text-white/90 text-sm"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div
                    className="mt-auto text-right line-clamp-3 font-faseyha text-white/90"
                    style={{
                      fontSize: blog.fontSize === 'small' ? '0.875rem' : 
                              blog.fontSize === 'large' ? '1.125rem' : '1rem'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(0, 150) + '...'
                    }}
                  />

                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}