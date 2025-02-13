import EditBlogClient from './EditBlogClient';

export default function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditBlogClient id={params.id} />;
}