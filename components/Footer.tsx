import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = [
    { name: 'ހޯމް', href: '/' },
    { name: 'ޝެއިޚުގެ ތަޢާރރަފ', href: '/about' },
    { name: 'ލިޔުންތައް', href: '/blog' },
    { name: 'ޕީ.ޑީ.އެފް', href: '/pdfs' },
  ];

  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-800 text-emerald-100 py-12 sm:py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
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
              <h3 className="text-xl sm:text-2xl font-bold font-faseyha text-white">
            أَحْمَد مُوسَى جِبْرِيل            
            </h3>
              </Link>
            </div>
            <p className="text-emerald-200 text-sm sm:text-base leading-relaxed">
              ޝެއިޚް އަޙްމަދު މޫސާ ޖިބްރީލްގެ ދިވެހި ބަހަށް ތަރުޖަމާ ކުރެިވފައިވާ ލިޔުންތައް.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-white">ލިންކްސް</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-emerald-200 hover:text-white text-base transition-all duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white">ސޯޝަލް މީޑިޔާ</h4>
            <div className="mt-4 flex space-x-6">
              <a 
                href="https://t.me/ShaykhAMJmv" 
                className="text-emerald-200 hover:text-white transform hover:scale-110 transition-all duration-200"
                aria-label="Telegram"
              >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
             >
              <path d="M21.5 2.5L2 10.5l6.5 2.5 2 6.5 3.5-4 5 3 2.5-15.5zM9 12l9-6-7 7-2 5.5-1-6z" />
             </svg>
              </a>
              <a 
                href="#" 
                className="text-emerald-200 hover:text-white transform hover:scale-110 transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.73 14.5v7.24h3.02v-7.24h2.03l.3-2.5h-2.33v-1.6c0-.72.2-1.22 1.23-1.22h1.32V6.5h-1.83c-2 0-2.74 1.22-2.74 2.5v1.5H8.42v2.5h2.31zM22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.98 3.64 9.11 8.42 9.87v-6.97H8.42v-2.5h2V9.5c0-2 1.22-3.5 3-3.5h2.5v2.5h-1.5c-.83 0-1 .5-1 1v2h2.5l-.5 2.5h-2v6.97C18.36 21.11 22 16.98 22 12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-emerald-700/50 text-center">
          <p className="text-emerald-200 text-sm sm:text-base">
            © {new Date().getFullYear()} ދިވެހި ބުލޮގް. ހަމަ ހައްގު ރައްކާތެރި.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;