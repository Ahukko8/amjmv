"use client";

import { useAuth } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function AdminHome() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 font-faseyha flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-4">
          އެޑްމިން ޕޭޖް
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {isSignedIn
            ? 'އަޅާލާގޮތް ހަމަޖެހިފައި، ޑޭޝްބޯޑްއަށް ދާންދޭ'
            : 'އެޑްމިން ޕޭޖަށް ލޮގިން ކުރޭ'}
        </p>

        

        {isSignedIn ? (
          <Link href="/admin/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md">
              ޑޭޝްބޯޑް
            </Button>
          </Link>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md">
              ލޮގިން
            </Button>
          </SignInButton>
        )}
      </div>
    </main>
  );
}