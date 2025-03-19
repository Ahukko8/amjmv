"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';



export default function AdminHeader() {
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { name: 'ޑޭޝްބޯޑް', path: '/admin/dashboard' },
    { name: 'އެހެން ޗެނަލްތަކުގެ ޑޭޝްބޯޑް', path: '/admin/otherChannel' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Navigation */}
          <div className="flex flex-col mt-2 md:flex-row  md:items-center pb-4 md:pb-0">
            <div className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => (

                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative font-faseyha text-black text-lg font-medium transition-all duration-300 group ${pathname === item.path || pathname.startsWith(`${item.path}/`)}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black  scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"></span>
                </Link>
              ))}
            </div>
          </div>
          {/* Logo and Title */}
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile User Info */}
              <div className="flex items-center gap-2 md:hidden">
                <UserButton afterSignOutUrl="/" />
                <span className="text-2xl font-bold  font-faseyha">އެޑްމިން ޑޭޝްބޯޑް</span>
              </div>
            </div>
            <div className="hidden md:flex gap-5 md:items-center md:mr-0 md:ml-6">
              <UserButton afterSignOutUrl="/" />
              <span className="text-2xl font-bold  font-faseyha">އެޑްމިން ޑޭޝްބޯޑް</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}