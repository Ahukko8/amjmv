"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Hero from './Hero';
import { Blog } from '@/types/blog';

interface HeaderProps {
  onSearch?: (blogs: Blog[]) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (blogs: Blog[]) => {
    onSearch?.(blogs);
  };

  const navLinks = [
    { name: 'ފުރަތަމަ ޞަފްޙާ', href: '/' },
    { name: 'ޝެއިޚުގެ ތަޢާރަފް', href: '/about' },
    { name: 'ލިޔުންތައް', href: '#' },
    { name: 'ގުޅުއްވާ', href: '#' },
  ];

  return (
    <nav className="relative bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo or Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-faseyha">
              ދިވެހި ބުލޮގް
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base lg:text-lg font-medium transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero onSearch={handleSearch} />
      </div>
    </nav>
  );
};

export default Header;