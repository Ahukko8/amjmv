"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  // Sample team data (replace with your own)
  const teamMembers = [
    {
      name: 'Aminath Ali',
      role: 'Founder & CEO',
      image: '/images/team/aminath.jpg', // Placeholder path
      bio: 'Aminath has over 10 years of experience in tech leadership.',
    },
    {
      name: 'Hassan Mohamed',
      role: 'Lead Developer',
      image: '/images/team/hassan.jpg',
      bio: 'Hassan is passionate about building scalable web applications.',
    },
    {
      name: 'Fathima Ibrahim',
      role: 'Designer',
      image: '/images/team/fathima.jpg',
      bio: 'Fathima crafts user-friendly and beautiful designs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            About Us
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            We’re a team dedicated to creating impactful solutions with innovation and passion.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-pattern.svg" // Optional: Add a subtle background pattern
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We strive to empower individuals and businesses by delivering cutting-edge technology and exceptional user experiences. Our goal is to make a lasting impact, one project at a time.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Innovation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Pushing the boundaries of what’s possible with technology.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Community</h3>
              <p className="mt-2 text-sm text-gray-600">
                Building connections and supporting each other’s growth.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Excellence</h3>
              <p className="mt-2 text-sm text-gray-600">
                Delivering top-quality results in everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Meet Our Team
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              A group of creative minds driving our vision forward.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-indigo-600">{member.role}</p>
                  <p
                    className={`mt-2 text-sm text-gray-600 transition-opacity duration-300 ${
                      hoveredMember === index ? 'opacity-100' : 'opacity-0 h-0'
                    }`}
                  >
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <section className="py-12 sm:py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Ready to Work With Us?
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto">
            Let’s collaborate to bring your ideas to life. Reach out today!
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}