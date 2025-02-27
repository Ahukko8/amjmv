"use client";

import BlogEdit from './EditBlogClient'; // Adjust path if needed

interface BlogEditProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: BlogEditProps) {
  return <BlogEdit params={params} />;
}