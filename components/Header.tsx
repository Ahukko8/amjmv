"use client"
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'ފުރަތަމަ ޞަފްޙާ', href: '#' },
    { name: 'ޝެއިޚުގެ ތަޢާރަފް', href: '#' },
    { name: 'ލިޔުންތައް', href: '#' },
    { name: 'ގުޅުއްވާ', href: '#' }
  ];

  return (
    <nav className="relative bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5 md:py-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-right leading-tight text-white">
          الشيخ أحمد موسى جبريل حفظه الله
          </h2>
          <p className="text-xl text-gray-300  mr-auto text-right leading-relaxed">
           ޝެއިޚުގެ މަސައްކަތް ފުޅުތަކުގެ ދިވެހި އަރުޝީފު
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Header;