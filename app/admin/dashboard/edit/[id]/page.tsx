// app/admin/dashboard/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { Blog } from "@/types/blog"; // Import the Blog type

type EditBlogProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function EditBlog({ params }: EditBlogProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error("Blog not found");
        }
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        router.push("/admin/dashboard");
      }
    };

    fetchBlog();
  }, [params.id, router]);

  const handleSubmit = async (blogData: Partial<Blog>) => {
    if (!params?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!params?.id || !blog) return;

    setPublishing(true);
    try {
      const newStatus = blog.status === "published" ? "draft" : "published";
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBlog((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setPublishing(false);
    }
  };

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Blog</h1>
        <button
          onClick={handlePublishToggle}
          disabled={publishing}
          className={`px-4 py-2 rounded ${
            blog.status === "published"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {publishing ? "Processing..." : blog.status === "published" ? "Unpublish" : "Publish"}
        </button>
      </div>

      <BlogEditor initialData={blog} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}