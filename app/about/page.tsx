"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="min-h-screen bg-emerald-50 font-faseyha">
      <Header/>
      {/* Hero Section */}
      <section className="relative bg-emerald-700 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-3xl sm:text-5xl font-bold tracking-tight"
          >
            ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto"
          >
            އިސްލާމިކް ޢިލްމުގެ ޝެއިޚެއް އަދި ދަޢުވަތްތެރިޔެއް
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-pattern.svg" // Optional: Subtle background pattern
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-12 sm:py-20 bg-white">
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
                src="/images/sheikh-ahmed-musa-jibril.jpg" // Placeholder path, replace with actual image
                alt="Sheikh Ahmed Musa Jibril"
                fill
                className="object-cover rounded-full shadow-lg border-4 border-emerald-100"
              />
            </div>

            {/* Biography Text */}
            <div className="text-center lg:text-right">
              <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900 mb-4">
                ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލްގެ ޢުމުރުގެ ތަފްޞީލް
              </h2>
              <p className="text-base sm:text-lg text-emerald-700 leading-relaxed">
                ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް 1971 ވަނަ އަހަރު އެމްރިކާގައި ފަލަސްތީނީ އެއް ޢައިލައަށް އުފަންވެއެވެ. އެމީހުންގެ މަނިކުފާނު، ޝެއިޚު މޫސާ ޖިބްރީލް، ސައުދި ޢަރަބިއްޔާގައި މަދީނަތުލް-މުނައްވަރާގެ އިސްލާމިކް ޔުނިވަރސިޓީގައި ޢިލްމު އުގަންނައިފިތަން، އެ ވަގުތު ޝެއިޚު އަޙްމަދު އަދި 11 އަހަރުގެ ޢުމުރުގައި ޤުރުއާން ހިފުޒު ކޮށްފިއެވެ. 1989 ގައި އެމީހުން އެމްރިކާއަށް އެނބުރި އައިސްފައި، އެންމެ ފަހުން ހައި ސްކޫލް ފުންކޮށްފިއެވެ. އެއަށްފަހު ޝެއިޚު އަޙްމަދު މަދީނަތުލް-މުނައްވަރާގެ އިސްލާމިކް ޔުނިވަރސިޓީއަށް ދިވެ ޝަރީޢަތުގެ ޑިގްރީއެއް ހަމަޖައްސައިފިއެވެ.
              </p>
              <p className="mt-4 text-base sm:text-lg text-emerald-700 leading-relaxed">
                އެމީހުން އެމްރިކާއަށް އެނބުރި އައިސްފައި، މިޝިގަންގެ ލޯ ސްކޫލްތަކުން ޖޭ.ޑީ/އެލް.އެލް.އެމް (މާސްޓަރސް އޮފް ލޯ) ޑިގްރީ ހަމަޖައްސައިފިއެވެ. ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް އިސްލާމިކް ޢިލްމުގެ ޝެއިޚެއް ގައި ވަޒީފާތަކަށް އަދި ދަޢުވަތްތެރިޔެއް ގައި މަޝްހޫރު ވެގެން އިސްލާމިކް ޢިލްމު އުގަންނައިފިއެވެ. އެމީހުން ދިވެހި ބަހަށް އިސްލާމިކް ދަޢުވަތް ކުރުމުގައި މަޝްހޫރު ވެގެން އެމީހުންގެ ދަޢުވަތްތަކީ ދިވެހި ބަހުގައި އަދި ޢަރަބި ބަހުގައި ފައިސަލު ކުރެވިފައި ވެއެވެ.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Achievements Section */}
      <section className="py-12 sm:py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900">
              ޝެއިޚުގެ ޚިދުމަތްތައް
            </h2>
            <p className="mt-4 text-lg text-emerald-700 max-w-3xl mx-auto">
              އިސްލާމިކް ދަޢުވަތުގެ ދާއިރާއިން ޝެއިޚު ކުރައްވާފައިވާ މަސައްކަތްތައް
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {/* Achievement Card 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-emerald-900 mb-2">ޢިލްމީ ލިޔުންތައް</h3>
              <p className="text-emerald-700 text-center">
                ޝެއިޚު ދިވެހި އަދި ޢަރަބި ބަހުން ލިޔުއްވާފައިވާ ފޮތްތަކާއި މަޒުމޫނުތައް
              </p>
            </div>
            
            {/* Achievement Card 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-emerald-900 mb-2">ދަރުސްތައް</h3>
              <p className="text-emerald-700 text-center">
                އިސްލާމިކް މުޖުތަމަޢުތަކުގައި ޝެއިޚު ދެއްވާފައިވާ ދަރުސްތަކާއި ޚުޠުބާތައް
              </p>
            </div>
            
            {/* Achievement Card 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-emerald-900 mb-2">ބައިނަލްއަޤްވާމީ ދަޢުވަތު</h3>
              <p className="text-emerald-700 text-center">
                އިސްލާމިކް ދަޢުވަތުގެ ދާއިރާއިން ޝެއިޚު ބައިނަލްއަޤްވާމީ ފެންވަރުގައި ކޮށްދެއްވާފައިވާ ޚިދުމަތްތައް
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <section className="py-12 sm:py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold">
              ތިމާގެ ތަޢާރަފް އަދި ޢިލްމު
            </h2>
            <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto">
              ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލްގެ ޢިލްމާއި ދަޢުވަތްތަކާއި ގުޅިގެން ތަފްޞީލް އެއްލާލުމަށް މަގުފަރިކަމެއް ނެތްތަ؟
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md"
              >
                ގުޅުން
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}