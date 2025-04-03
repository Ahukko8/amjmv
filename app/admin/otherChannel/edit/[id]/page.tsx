"use client";

import OtherBlogEdit from './OtherEditBlogClient'; // Adjust path if needed

interface BlogEditProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: BlogEditProps) {
  return <OtherBlogEdit params={params} />;
}