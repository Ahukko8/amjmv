import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const footerLinks = [
    { name: 'ހޯމް', href: '/' },
    { name: 'ޝައިޚްގެ ތަޢާރަފް', href: '/about' },
    { name: 'ލިޔުންތައް', href: '/blog' },
    { name: 'ޕީ.ޑީ.އެފް', href: '/pdfs' },
    { name: 'އެހެނިހެންް ލިޔުންތައް', href: '/otherChannel' },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90"></div>
      
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border-t border-white/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="transition-transform hover:scale-105 duration-300">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Image
                      src="/logo.png"
                      width={80}
                      height={80}
                      alt='logo'
                      className="rounded-lg"
                    />
                  </div>
                </Link>
              </div>
              <p className="text-white/90 text-base leading-relaxed font-light">
                ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލްގެ ދިވެހި ބަހަށް ތަރުޖަމާ ކުރެވިފައިވާ ލިޔުންތައް
              </p>
            </div>

            {/* Links Section */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white relative">
                ލިންކްސް
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-white/50 rounded-full"></div>
              </h4>
              <ul className="space-y-4">
                {footerLinks.map((link) => (
                  <li key={link.name} className="transform transition-all duration-300 hover:translate-x-2">
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-3 text-white/80 hover:text-white text-base transition-all duration-300 p-2 rounded-lg hover:bg-white/5 backdrop-blur-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors duration-300 group-hover:scale-125"></div>
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Section */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white relative">
                ސޯޝަލް މީޑިޔާ
                <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-white to-white/50 rounded-full"></div>
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://t.me/ShaykhAMJmv" 
                  className="group p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10"
                  aria-label="Telegram"
                >
                  <svg
                    className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.5 2.5L2 10.5l6.5 2.5 2 6.5 3.5-4 5 3 2.5-15.5zM9 12l9-6-7 7-2 5.5-1-6z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="group p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10"
                  aria-label="Facebook"
                >
                  <svg 
                    className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.73 14.5v7.24h3.02v-7.24h2.03l.3-2.5h-2.33v-1.6c0-.72.2-1.22 1.23-1.22h1.32V6.5h-1.83c-2 0-2.74 1.22-2.74 2.5v1.5H8.42v2.5h2.31zM22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.98 3.64 9.11 8.42 9.87v-6.97H8.42v-2.5h2V9.5c0-2 1.22-3.5 3-3.5h2.5v2.5h-1.5c-.83 0-1 .5-1 1v2h2.5l-.5 2.5h-2v6.97C18.36 21.11 22 16.98 22 12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-16 pt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                <p className="text-white/70 text-sm font-light">
                  © {new Date().getFullYear()} • ހުރިހާ ޙައްޤުތަކެއް ހިމާޔަތްކުރެވިފައި
                </p>
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;