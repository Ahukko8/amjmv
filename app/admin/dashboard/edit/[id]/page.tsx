// app/admin/dashboard/edit/[id]/page.tsx
import EditBlogClient from './EditBlogClient';

interface PageProps {
  params: { id: string } | Promise<{ id: string }>; // Key change here!
}

export default function EditBlogPage({ params }: PageProps) {
  // Handle the case where params is a Promise (though it won't be in this example)
  const id = typeof params === 'object' && 'id' in params ? params.id : undefined;

    if (!id) {
        return <div>Loading...</div> // Or handle the undefined case
    }
  return <EditBlogClient id={id} />;
}