import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { MongoDBBlog } from "@/types/mongodb";
import BlogList from "./BlogList";
import { Blog as BlogType } from '@/types/blog';


export default async function BlogPosts(){
    try {
        await connectDB();
        
        const blogsFromDB = await Blog.find({ status: 'published' })
          .sort({ createdAt: -1 })
          .lean<MongoDBBlog[]>();
    
        // Add null check and type guard for author
        const blogs: BlogType[] = blogsFromDB.map(blog => ({
          _id: blog._id.toString(),
          title: blog.title,
          content: blog.content,
          author: blog.author ? {
            _id: blog.author._id?.toString() || '',
            name: blog.author.name || 'Anonymous'
          } : {
            _id: '',
            name: 'Anonymous'
          },
          featured: blog.featured,
          status: blog.status,
          fontFamily: blog.fontFamily || 'default',
          fontSize: blog.fontSize || 'medium',
          createdAt: blog.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: blog.updatedAt?.toISOString() || new Date().toISOString()
        }));
    
        const recentPosts = blogs

        return (
            <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-right">
                އެންމެ ފަހުގެ ލިޔުންތައް
              </h2>
              <BlogList blogs={recentPosts} />
            </div>
          </section>
        )
} catch (error) {
    console.error('Error in Home page:', error);
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }
}
