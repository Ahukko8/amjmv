"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Sample images and Telegram links (replace with your actual data)
const introImages = [
  { src: '/images/galandhaan.jpg', alt: 'ގަލަންދާނު', telegram: 'https://t.me/qalandhar' },
  { src: '/images/tazkirat.jpg', alt: 'ތަޛްކިރަތުއް ނުފޫސް', telegram: 'https://t.me/Tazkirat_Nufoos' },
  { src: '/images/qanadeel.jpg', alt: 'އަލް-ޤަނާދީލް', telegram: 'https://t.me/alqanaadeel' },
];

const Intro: React.FC = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const slideInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 md:pb-24 lg:pt-52 lg:pb-32 xl:pt-60 xl:pb-40 bg-gradient-to-br from-gray-50 via-white to-slate-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>

      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInDown}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700 bg-clip-text text-transparent leading-relaxed tracking-tight font-faseyha px-4 py-2"
            style={{ lineHeight: '1.6' }}
          >
            ދިވެހި ތަރުޖަމާތައް ނެގިފައިވާ<br className="hidden sm:block" />
            <span className="block mt-2 sm:mt-3 lg:mt-4">ބައެއް ޓެލެގްރާމް ޗެނަލްތައް</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-600 font-light leading-relaxed tracking-wide font-faseyha px-4"
            style={{ lineHeight: '1.8' }}
          >
            މި ބޭފުޅުންގެ މަސައްކަތުގައި الله تعالى ބަރަކާތް ލައްވައި ޤަބޫލްކުރައްވާށި. އާމީން!
          </motion.p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="grid gap-6 sm:gap-7 md:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {introImages.map((img, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative h-72 sm:h-80 md:h-[22rem] lg:h-96 rounded-2xl overflow-hidden shadow-lg group"
            >
              <Link href={img.telegram} target="_blank" rel="noopener noreferrer">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 via-purple-400/50 to-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                {/* Image Container */}
                <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                  {/* Text Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8">
                    <span
                      className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-faseyha drop-shadow-2xl text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 leading-tight tracking-wide px-2"
                      style={{ lineHeight: '1.3' }}
                    >
                      {img.alt}
                    </span>

                    {/* Telegram Icon */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.114.78.89z" />
                        </svg>
                        <span className="text-white text-sm sm:text-base font-semibold tracking-wide">ބައްލަވާ</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;