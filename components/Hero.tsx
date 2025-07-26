"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/slide1.jpg',
    title: 'ދިވެހި ބަހަށް ތަރުޖަމާ ކުރެވިފައިވާ ލިޔުންތައް',
    subtitle: 'އެންމެ ފަހުގެ ދަރުސްތަކުން ނެގިފައި',
  },
  {
    image: '/images/slide2.jpg',    
    title: 'ދިމަކުރާތީ ނިޒާމުގެ ޙަޤީޤަތްތައް',
    subtitle: 'މުރުޖިޢާއިންގެ ޝުބުހަތައް ކަޝްފުކުރުން',
  },
  {
    image: '/images/slide3.jpg',    
    title: 'އިސްލާމީ ޝަރީޢަތް ތަންފީޛުކުރުން',
    subtitle: 'އިސްލާމީ ޝަރީޢަތް ތަންފީޛުކުރުން ލަސްނުކުރެވޭނެކަން ހާމަކުރުން',
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 8000);

    return () => clearInterval(interval);
  }, );

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] xl:h-[80vh] overflow-hidden bg-black/95">
      {/* Background slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background image with parallax effect */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-700 ease-out"
              style={{ 
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
              }}
            />
            
            {/* Gradient overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          </div>
        ))}
      </div>

      {/* Content container */}
      <div className="absolute inset-0 z-10">
        <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Glassmorphism content card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl">
              <div 
                className={`transition-all duration-500 ease-out ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 font-faseyha">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed font-faseyha">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-white/90" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-white/90" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index 
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-white' 
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-gradient-to-r from-white/60 to-white/90 transition-all duration-300 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            transform: isTransitioning ? 'scaleY(1.5)' : 'scaleY(1)'
          }}
        />
      </div>
    </div>
  );
};

export default Hero;