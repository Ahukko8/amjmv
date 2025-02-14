"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { Blog } from "@/types/blog";

interface EditBlogClientProps {
  id: string;
}

export default function EditBlogClient({ id }: EditBlogClientProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog not found");
          } else {
            setError("Failed to fetch blog");
          }
          return;
        }
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("An error occurred while fetching the blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (blogData: Partial<Blog>) => {
    if (!blog) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
      setError("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!blog) return;

    setPublishing(true);
    try {
      const newStatus = blog.status === "published" ? "draft" : "published";
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle publish status");
      }

      setBlog((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError("Failed to toggle publish status");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
  
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
  
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg">Blog not found</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Edit Blog</h1>
  <div className="flex gap-4"> {/* Added this wrapper div */}
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
    <button
      onClick={handlePublishToggle}
      disabled={publishing}
      className={`px-4 py-2 rounded ${
        blog.status === "published"
          ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-green-500 hover:bg-green-600"
      } text-white`}
    >
      {publishing
        ? "Processing..."
        : blog.status === "published"
        ? "Unpublish"
        : "Publish"}
    </button>
  </div>
</div>
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
          {publishing
            ? "Processing..."
            : blog.status === "published"
            ? "Unpublish"
            : "Publish"}
        </button>
      </div>

      <BlogEditor initialData={blog} onSubmit={handleSubmit} loading={loading} />
    </div>
    </>
    
  );
}
