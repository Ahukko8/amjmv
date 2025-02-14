// app/admin/layout.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import type { OrganizationMembership } from "@clerk/nextjs/server";
import '@/app/globals.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  // If no user is authenticated, redirect to sign in
  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check for admin role using user's metadata
  // You need to set this up in your Clerk Dashboard first
  const isAdmin = user.publicMetadata.role === 'admin';

  // If user is not an admin, redirect to home page
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold font-faseyha">އެޑްމިން ޑޭޝްބޯޑް</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4 font-faseyha">
                މަރުޙަބާ, {user.firstName || user.username}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 font-faseyha">
        {children}
      </main>
    </div>
  );
}