// app/admin/dashboard/edit/[id]/page.tsx
import EditBlogClient from './EditBlogClient';

interface PageProps {
  params: { id: string };
}

export default function EditBlogPage({ params }: PageProps) {
  return <EditBlogClient id={params.id} />;
}