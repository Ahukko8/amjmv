// lib/actions.ts
import { Blog } from "@/types/blog";
import { otherBlog } from "@/types/otherBlog";

export async function getBlog(id: string): Promise<Blog> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}


export async function getOtherBlog(id: string): Promise<otherBlog> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otherChannelBlogs/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}