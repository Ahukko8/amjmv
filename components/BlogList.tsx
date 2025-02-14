// components/BlogList.tsx
import Link from 'next/link';
import { Blog } from '@/types/blog';

interface BlogListProps {
  blogs: Blog[];
}

// Modern gradient variations
const cardStyles = [
  'bg-gradient-to-r from-violet-600 to-indigo-600',
  'bg-gradient-to-r from-blue-600 to-violet-600',
  'bg-gradient-to-r from-indigo-600 to-purple-600',
];

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 font-faseyha">
      {blogs.map((blog, index) => (
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
            {/* Modern grain overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-soft-light" />
            
            {/* Content container */}
            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-3 text-right font-faseyha text-white">
                {blog.title}
              </h2>
              
              <div className="text-white/80 text-sm text-right mb-4">
                {new Date(blog.createdAt).toLocaleDateString('dv-MV')}
              </div>
              
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

              {/* Modern decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}