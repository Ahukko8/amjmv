"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-faseyha">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            އިސްލާމިކް ޢިލްމުގެ ޝެއިޚެއް އަދި ދަޢުވަތްތެރިޔެއް
          </p>
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
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Sheikh's Picture */}
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
              <Image
                src="/images/sheikh-ahmed-musa-jibril.jpg" // Placeholder path, replace with actual image
                alt="Sheikh Ahmed Musa Jibril"
                fill
                className="object-cover rounded-full shadow-lg border-4 border-indigo-100"
              />
            </div>

            {/* Biography Text */}
            <div className="text-center lg:text-right">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލްގެ ޢުމުރުގެ ތަފްޞީލް
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް 1971 ވަނަ އަހަރު އެމްރިކާގައި ފަލަސްތީނީ އެއް ޢައިލައަށް އުފަންވެއެވެ. އެމީހުންގެ މަނިކުފާނު، ޝެއިޚު މޫސާ ޖިބްރީލް، ސައުދި ޢަރަބިއްޔާގައި މަދީނަތުލް-މުނައްވަރާގެ އިސްލާމިކް ޔުނިވަރސިޓީގައި ޢިލްމު އުގަންނައިފިތަން، އެ ވަގުތު ޝެއިޚު އަޙްމަދު އަދި 11 އަހަރުގެ ޢުމުރުގައި ޤުރުއާން ހިފުޒު ކޮށްފިއެވެ. 1989 ގައި އެމީހުން އެމްރިކާއަށް އެނބުރި އައިސްފައި، އެންމެ ފަހުން ހައި ސްކޫލް ފުންކޮށްފިއެވެ. އެއަށްފަހު ޝެއިޚު އަޙްމަދު މަދީނަތުލް-މުނައްވަރާގެ އިސްލާމިކް ޔުނިވަރސިޓީއަށް ދިވެ ޝަރީޢަތުގެ ޑިގްރީއެއް ހަމަޖައްސައިފިއެވެ.
                <br /><br />
                އެމީހުން އެމްރިކާއަށް އެނބުރި އައިސްފައި، މިޝިގަންގެ ލޯ ސްކޫލްތަކުން ޖޭ.ޑީ/އެލް.އެލް.އެމް (މާސްޓަރސް އޮފް ލޯ) ޑިގްރީ ހަމަޖައްސައިފިއެވެ. ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލް އިސްލާމިކް ޢިލްމުގެ ޝެއިޚެއް ގައި ވަޒީފާތަކަށް އަދި ދަޢުވަތްތެރިޔެއް ގައި މަޝްހޫރު ވެގެން އިސްލާމިކް ޢިލްމު އުގަންނައިފިއެވެ. އެމީހުން ދިވެހި ބަހަށް އިސްލާމިކް ދަޢުވަތް ކުރުމުގައި މަޝްހޫރު ވެގެން އެމީހުންގެ ދަޢުވަތްތަކީ ދިވެހި ބަހުގައި އަދި ޢަރަބި ބަހުގައި ފައިސަލު ކުރެވިފައި ވެއެވެ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <section className="py-12 sm:py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            ތިމާގެ ތަޢާރަފް އަދި ޢިލްމު
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto">
            ޝެއިޚު އަޙްމަދު މޫސާ ޖިބްރީލްގެ ޢިލްމާއި ދަޢުވަތްތަކާއި ގުޅިގެން ތަފްޞީލް އެއްލާލުމަށް މަގުފަރިކަމެއް ނެތްތަ؟
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors"
            >
              ގުޅުން
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}