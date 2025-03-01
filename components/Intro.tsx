"use client";

import React from 'react';
// import Image from 'next/image';
import { motion } from 'framer-motion';


// Sample images (replace with your own)
const introImages = [
  { src: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', alt: 'Dhivehi Culture' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', alt: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1497436072909-60f34c89a287', alt: 'Literature' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', alt: 'Community' },
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
    <section className="py-12 sm:py-16 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-900 font-faseyha">
            ދިވެހި ލިޔުންތަކުގެ ޢާލަމަށް މަރުޙަލާ
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-emerald-700 max-w-3xl mx-auto font-faseyha">
            މި ވެބްސައިޓްގައި ދިވެހި ބަސްފުޅުގެ ތަފްޞީލާއި، ވާހަކަތަކާއި، އަދި މަޢުލޫމާތު ޝާއިޢު ކުރަމުން ދިޔަ އެއްޗެކެވެ
          </p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {introImages.map((img, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative h-56 sm:h-64 rounded-xl overflow-hidden shadow-md group"
            >
              {/* <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              /> */}
              <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-base sm:text-lg font-semibold font-faseyha drop-shadow-md">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;