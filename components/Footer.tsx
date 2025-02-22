import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 sm:py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-faseyha">
              ދިވެހި ބުލޮގް
            </h3>
            <p className="mt-2 text-sm sm:text-base">
              Sharing stories and insights from the Maldives.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white">Links</h4>
            <ul className="mt-2 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social or Extra */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white">Follow Us</h4>
            <div className="mt-2 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.5 4.46 9.96 9.96 9.96s9.96-4.46 9.96-9.96c0-5.5-4.46-9.96-9.96-9.96zm0 1.5c4.67 0 8.46 3.79 8.46 8.46s-3.79 8.46-8.46 8.46-8.46-3.79-8.46-8.46 3.79-8.46 8.46-8.46zm-1.5 3.5v3.5h-2v1.5h2v3.5h1.5v-3.5h2v-1.5h-2v-3.5h-1.5z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.14 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.8.61-3.4-1.35-3.4-1.35-.46-1.17-1.12-1.48-1.12-1.48-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.56 9.56 0 012.5-.34c.85 0 1.71.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A9.97 9.97 0 0022.96 12c0-5.5-4.46-9.96-9.96-9.96z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm sm:text-base">
          <p>© {new Date().getFullYear()} Dhivehi Blog. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;