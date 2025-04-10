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
  // Animation variants for scroll
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

  return (
    <section className="py-12 sm:py-16 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F5F5] font-faseyha">
            ދިވެހި ތަރުޖަމާތައް ނެގިފައިވާ ބައެއް ޓެލެގްރާމް ޗެނަލްތައް
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-[#F5F5F5] max-w-3xl mx-auto font-faseyha">
            މި ބޭފުޅުންގެ މަސައްކަތުގައި الله تعالى ބަރަކާތް ލައްވައި ޤަބޫލްކުރައްވާށި. އާމީން!
          </p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {introImages.map((img, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-md group"
            >
              <Link href={img.telegram} target="_blank" rel="noopener noreferrer">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#121212]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-base sm:text-lg font-semibold font-faseyha drop-shadow-md">
                    {img.alt}
                  </span>
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