// app/admin/dashboard/edit/[id]/page.tsx
import EditBlogClient from './EditBlogClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  // Await the params object to get the actual route parameters
  const { id } = await params;

  return <EditBlogClient id={id} />;
}
