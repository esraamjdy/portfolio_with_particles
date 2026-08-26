'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleQuestionMark } from './ParticleQuestionMark';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const },
    },
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative z-30 min-h-screen flex items-center justify-center overflow-x-hidden pointer-events-auto">
      {/* Backdrop glow behind content without gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none bg-[#BA6A4C]"
      />

      {/* Content */}
      <motion.div
        className="relative z-30 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        {/* Decorative line + Greeting */}
        <motion.div className="flex items-center justify-center gap-4 mb-6" variants={itemVariants}>
          <p
            className="text-sm md:text-base uppercase tracking-[0.3em] font-medium"
            style={{ color: '#BA6A4C' }}
          >
            Hello, I&apos;m
          </p>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 leading-tight"
          style={{ color: '#EEE0CC' }}
          variants={itemVariants}
        >
          Esraa Magdy
        </motion.h1>

        {/* Role tagline */}
        <motion.p
          className="text-base md:text-lg tracking-widest uppercase mb-12 font-medium"
          style={{ color: '#607456' }}
          variants={itemVariants}
        >
          Web Designer & Developer
        </motion.p>

        {/* Question — the hero headline */}
        <motion.div className="mb-12 flex justify-center" variants={itemVariants}>
          <h2
            className="font-bold tracking-tight leading-tight inline-flex items-baseline whitespace-nowrap"
            style={{ color: '#EEE0CC', fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
          >
            Need a creative website
            <span id="hero-question-anchor" className="inline-block relative ml-2 w-[0.8em] h-[0.8em] align-baseline" />
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-14"
          variants={itemVariants}
        >
          I craft beautiful, interactive experiences that combine
          <span style={{ color: '#BA6A4C' }}> design thinking </span>
          with modern web technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex gap-5 flex-wrap justify-center z-50 relative pointer-events-auto" variants={itemVariants}>
          <a
            href="#work"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('work');
            }}
            className="group cursor-pointer px-10 py-3.5 rounded-full font-semibold text-sm md:text-base tracking-wide transition-all duration-300 shadow-lg active:scale-95 select-none"
            style={{
              backgroundColor: '#BA6A4C',
              color: '#EEE0CC',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(186, 106, 76, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            View My Work →
          </a>
          <a
            href="#contact"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('contact');
            }}
            className="cursor-pointer px-10 py-3.5 rounded-full font-semibold text-sm md:text-base tracking-wide border transition-all duration-300 active:scale-95 select-none"
            style={{
              borderColor: 'rgba(96, 116, 86, 0.6)',
              color: '#EEE0CC',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(96, 116, 86, 0.2)';
              e.currentTarget.style.borderColor = '#607456';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(96, 116, 86, 0.6)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer pointer-events-auto"
        onClick={() => scrollToId('about')}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Scroll</p>
          <svg
            className="w-5 h-5 mx-auto"
            style={{ color: '#607456' }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
