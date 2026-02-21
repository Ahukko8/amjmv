"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'ހޯމް', href: '/' },
    { name: 'ޝައިޚްގެ ތަޢާރަފް', href: '/about' },
    { name: 'ލިޔުންތައް', href: '/blog' },
    { name: 'ޕީ.ޑީ.އެފް', href: '/pdfs' },
    { name: 'އެހެން ޗެނަލްތައް', href: '/otherChannel' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-faseyha">
      {/* Glassmorphism background */}
      <div className="backdrop-blur-md bg-black/20 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo/Title */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={200}
                  height={150}
                  alt='logo'
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                {navLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <Link
                      href={link.href}
                      className="relative text-white/90 hover:text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/10 group"
                    >
                      {link.name}
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    </Link>
                    {index < navLinks.length - 1 && (
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/90 hover:text-white p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 backdrop-blur-lg bg-black/40 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-8 border border-white/10 space-y-4">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-white/90 hover:text-white text-lg font-medium py-3 px-6 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-105 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {index < navLinks.length - 1 && (
                    <div className="h-px bg-white/20 mx-4"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;