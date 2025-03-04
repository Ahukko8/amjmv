"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'ހޯމް', href: '/' },
    { name: 'ޝައިޚްގެ ތަޢާރަފް', href: '/about' },
    { name: 'ލިޔުންތައް', href: '/blog' },
    { name: 'ޕި.ޑީ.އެފް', href: '/pdfs' },
  ];

  return (
    <nav className="relative bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Title */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <svg 
              className="w-8 h-8 text-emerald-300"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
            <Link 
              href="/"
            >
              <h1 className="text-xl sm:text-2xl font-bold text-emerald-100 font-arabicAmj tracking-wide">
            أَحْمَد مُوسَى جِبْرِيل            
            </h1>
              </Link>
            
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-emerald-100 hover:text-white text-lg font-medium transition-all duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-200 hover:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden fixed inset-0 bg-emerald-900/95 backdrop-blur-lg z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-2"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-emerald-100 hover:text-white text-xl font-medium py-2 px-6 rounded-lg hover:bg-emerald-800/50 transition-all duration-200 transform hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;