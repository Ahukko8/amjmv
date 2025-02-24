"use client";

import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'ދިވެހި ލިޔުންތަކުގެ ޙާލު',
    subtitle: 'މަޢުލޫމާތު ހޯދުމަށް އަދި ހިއްސާ ކުރުމަށް',
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'ތަފްޞީލު އަދި މަޢުލޫމާތު',
    subtitle: 'ދިވެހި ބަސްފުޅުގެ ތެރޭގައި ހޯދާ',
  },
  {
    image: 'https://images.unsplash.com/photo-1497436072909-60f34c89a287?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'ހަމަޖެހުން ކުރުމަށް',
    subtitle: 'އަލުން ލިޔުންތައް ޝާއިޢު ކުރޭ',
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Adjust timing as needed (5000ms = 5s)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white font-faseyha">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold drop-shadow-md animate-fade-in">
                {slide.title}
              </h2>
              <p className="mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl drop-shadow-md animate-fade-in">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex gap-5 justify-center space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
  );
};

export default Hero;