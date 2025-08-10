"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { additionalTeachers, continuedDawahWork, dawahWork, earlyLife, recentSeries, teachersAndScholars } from '@/constants/biography';

export default function AboutPage() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // const fadeIn = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1, transition: { duration: 1.2 } },
  // };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-faseyha relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Header/>
      {/* Main Content */}
      <section className="mt-10 py-12 sm:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Sheikh's Portrait Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-16"
          >
            <div className="backdrop-blur-xl bg-white/90 border border-gray-300/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Sheikh's Picture */}
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-600/30 rounded-full blur-xl"></div>
                  <Image
                    src="/images/about.jpeg"
                    alt="Sheikh Ahmed Musa Jibril"
                    fill
                    className="object-cover rounded-full shadow-2xl border-4 border-gray-400/40 relative z-10"
                  />
                </div>

                {/* Brief Introduction */}
                <div className="text-center lg:text-right flex-1">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                    ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލް
                  </h2>
                  <p className="text-justify sm:text-lg text-gray-700 leading-relaxed mb-6">
                    ޝައިޚް އަޙްމަދު މޫސާ ޖިބްރީލް އަކީ ފަލަސްތީނު ދަރިފަސްކޮޅަށް ނިސްބަތްވާ ބޭފުޅެކެވެ. އަދި އުފަންވެވަޑައިގަތީ ޔުނައިޓެޑް ސްޓޭޓްސް (އެމެރިކާ) ގައެވެ.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Sections */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="space-y-16"
          >
            
            {/* Hayaathuge Kuee Kolhu */}
            <motion.article 
              variants={slideInLeft}
              className="backdrop-blur-xl bg-white/90 border border-gray-300/50 rounded-3xl p-8 sm:p-12 shadow-2xl"
            >
              <div className="flex items-center mb-8">
                <div className="w-2 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mr-6"></div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-5">ހަޔާތުގެ ކުރީ ކޮޅު</h3>
              </div>
              <div className="space-y-6 text-gray-700">
                <p className="text-justify sm:text-lg leading-relaxed">
                  {earlyLife}
                </p>
              </div>
            </motion.article>

            {/* Islamic Studies */}
            <motion.article 
              variants={fadeInUp}
              className="backdrop-blur-xl bg-white/90 border border-gray-300/50 rounded-3xl p-8 sm:p-12 shadow-2xl"
            >
              <div className="flex items-center mb-8">
                <div className="w-2 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full mr-6"></div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-5">އިސްލާމީ ތަޢުލީމް އަދި އުސްތާޒުން</h3>
              </div>
              <div className="space-y-6 text-gray-700">
                <p className="text-justify sm:text-lg leading-relaxed">
                  {teachersAndScholars}
                </p>
                <p className="text-justify sm:text-lg leading-relaxed">
                  {additionalTeachers}
                </p>
              </div>
            </motion.article>

            {/* Da'wah Work */}
            <motion.article 
              variants={slideInLeft}
              className="backdrop-blur-xl bg-white/90 border border-gray-300/50 rounded-3xl p-8 sm:p-12 shadow-2xl"
            >
              <div className="flex items-center mb-8">
                <div className="w-2 h-16 bg-gradient-to-b from-gray-800 to-black rounded-full mr-6"></div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-5">ދަޢުވަތުގެ މަސައްކަތްތައް</h3>
              </div>
              <div className="space-y-6 text-gray-700">
                <p className="text-justify sm:text-lg leading-relaxed">
                  {dawahWork}
                </p>
                <p className="text-justify sm:text-lg leading-relaxed">
                  {recentSeries}
                </p>
                 <p className="text-justify sm:text-lg leading-relaxed">
                  {continuedDawahWork}
                </p>
              </div>
            </motion.article>

          </motion.div>

          {/* Closing Du'a Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mt-16"
          >
            <div className="backdrop-blur-xl bg-white/95 border border-gray-400/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
              <div className="max-w-4xl mx-auto">
                <p className="text-justify sm:text-lg text-gray-700 leading-relaxed mb-6">
                  الله تعالى ޝައިޚްއާއި ޝައިޚްގެ ޢާއިލާގެ ފަރާތުންކުރައްވާ މިންނެތް މަސައްކަތްތަކަށް އިމެއްނެތް އަޖުރު ދެއްވާށިއެވެ. އަދި الله تعالى ޝައިޚްއަށާއި އަދި ޝައިޚްގެ ބައްޕާފުޅަށް ހެޔޮ ޢަމަލުތަކުން ފުރިގެންވާ ދިގު ޢުމުރެއް ދެއްވާށިއެވެ.
                </p>
                <p className="text-justify sm:text-lg text-gray-700 leading-relaxed">
                  އަދި الله تعالى ޝައިޚްގެ މަންމާފުޅުގެ ދަރަޖަ އުފުއްލަވައި ޖަންނަތުލް ފިރްދައުސްގައި ލައްވާށިއެވެ. 
                </p>
                <p className="text-2xl text-gray-900 font-bold mt-6">آمين</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
      
      <Footer />
    </div>
  );
}