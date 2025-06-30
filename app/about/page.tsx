"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  // Animation variants for scroll
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2 } },
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-faseyha">
      <Header/>
      {/* Hero Section */}
      <section className="relative bg-[#121212] text-[#F5F5F5] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-xl sm:text-5xl font-bold tracking-tight"
          >
            ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލް حفظه الله
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mt-4 text-sm sm:text-xl max-w-2xl mx-auto"
          >
            ޝައިޚްގެ ހަޔާތާއި ބެހޭގޮތުން ކުރު ތަޢާރަފެއް
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/logo.png" // Optional: Subtle background pattern
            alt="Background pattern"
            fill
            className="object-scale-down"
          />
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="flex flex-col lg:flex-row gap-8 items-center"
          >
            {/* Sheikh's Picture */}
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
              <Image
                src="/images/about.jpeg" // Placeholder path, replace with actual image
                alt="Sheikh Ahmed Musa Jibril"
                fill
                className="object-cover rounded-full shadow-lg border-4 border-[#121212]/20"
              />
            </div>

            {/* Biography Text */}
            <div className="text-center lg:text-right">
              <h2 className="text-2xl  sm:text-3xl font-semibold text-[#121212] mb-4">
                ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލް
              </h2>
              <p className="text-justify sm:text-lg text-[#121212] leading-relaxed">
              ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލް އުފަންވެވަޑައިގަތީ ޔުނައިޓެޑް ސްޓޭޓްސް (އެމެރިކާ) ގައެވެ. އަދި ޝައިޚްގެ ތުއްޕުޅުޢުމުރުން ބައެއް ހޭދަކުރެއްވީ ބިލާދުލް ޙަރަމައިންގެ މަދީނާގައެވެ. އޭރު ޝައިޚްގެ ބައްޕާފުޅު، ޝައިޚް މޫސާ ޖިބްރީލް އަކީ މަދީނާގެ އިސްލާމިކް ޔުނިވާރސިޓީގެ ދަރިވަރެކެވެ. ޝައިޚް އަޙްމަދުގެ ޢުމުރުފުޅުން 11 އަހަރުގައި ޤުރްއާން ހިތުދަސްކުރެއްވީ އެތަނުގައެވެ. އެއަށްފަހު ޝައިޚްގެ ޒުވާން ޢުމުރުފުޅުގެ އަހަރުތައް ހޭދަކުރެއްވީ ޔުނައިޓެޑް ސްޓޭޓްސްގައެވެ. އަދި 1989 ގައި ހައި ސްކޫލުން ގްރެޖުއޭޓް ވުމަށްފަހު، ދެން އުނގެނިވަޑައިގެންނެވީ މަދީނާގެ އިސްލާމިކް ޔުނިވާރސިޓީގައެވެ. އެތަނުން ޝަރީޢާގެ ދާއިރާއިން ޑިގްރީ ޙާޞިލްކުރެއްވިއެވެ. އެއަށްފަހު އަނެއްކާވެސް ޔުނައިޓެޑް ސްޓޭޓްސް އަށް އެނބުރި ވަޑައިގެން ލޯ އިން މާސްޓާރސް ޑިގްރީ ނިންމަވާލެއްވިއެވެ.              </p>
              <p className="mt-4 text-justify sm:text-lg text-[#121212] leading-relaxed">
              الله تعالى ޝައިޚްއާއި ޝައިޚްގެ ޢާއިލާގެ ފަރާތުންކުރައްވާ މިންނެތް މަސައްކަތްތަކަށް އިމެއްނެތް އަޖުރު ދެއްވާށިއެވެ. އަދި الله تعالى ޝައިޚްއަށާއި އަދި ޝައިޚްގެ ބައްޕާފުޅަށް ހެޔޮ ޢަމަލުތަކުން ފުރިގެންވާ ދިގު ޢުމުރެއް ދެއްވާށިއެވެ. އަދި الله تعالى ޝައިޚްގެ މަންމާފުޅުގެ ދަރަޖަ އުފުއްލަވައި ޖަންނަތުލް ފިރްދައުސްގައި ލައްވާށިއެވެ. آمين              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}