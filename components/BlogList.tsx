// components/BlogList.tsx
import Link from 'next/link';
import { Blog } from '@/types/blog';

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <Link
          key={blog._id}
          href={`/blog/${blog._id}`}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <article className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-right">{blog.title}</h2>
            <div className="text-gray-600 text-sm text-right">
              {new Date(blog.createdAt).toLocaleDateString('dv-MV')} - {blog.author.name}
            </div>
            <div
              className="mt-4 text-gray-600 text-right line-clamp-3"
              style={{
                fontFamily: blog.fontFamily,
                fontSize: blog.fontSize === 'small' ? '0.875rem' : 
                         blog.fontSize === 'large' ? '1.125rem' : '1rem'
              }}
              dangerouslySetInnerHTML={{
                __html: blog.content.slice(0, 150) + '...'
              }}
            />
          </article>
        </Link>
      ))}
    </div>
  );
}