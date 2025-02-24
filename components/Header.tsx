"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'ހޯމް', href: '/' },
    { name: 'ޝެއިޚުގެ ތަޢާރަފް', href: '/about' },
    { name: 'ބުލޮގުތައް', href: '/blog' },
    { name: 'ޕި.ޑީ.އެފް', href: '/pdfs' },
  ];

  return (
    <nav className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-faseyha tracking-tight">
              ދިވެހި ލިޔުން
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 items-center">
            <div className='flex flex-row lg:gap-10'> 
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-100 hover:text-white text-base lg:text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-indigo-900/95 backdrop-blur-md shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-100 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
      </div> */}
    </nav>
  );
};

export default Header;