'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    {
      id: 1,
      number: '1',
      title: 'réservesuisse',
      systemType: 'Web Portal & Calculation Engine',
      description: 'Modernized the web portal and duty-stock (Pflichtlager) calculation engine for Switzerland\'s food & feed supply security cooperative. Engineered type-safe calculation spreadsheets and automated workflow grids.',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'MUI'],
      demo: 'https://www.reservesuisse.ch/',
      accentColor: '#BA6A4C',
      svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#BA6A4C"/><text x="60" y="74" font-family="'Mouldy Cheese', sans-serif" font-weight="700" font-size="48" fill="#fff" text-anchor="middle">RS</text></svg>`,
    },
    {
      id: 2,
      number: '2',
      title: 'SABAG Client Portal',
      systemType: 'E-commerce & Product Finder Portal',
      description: 'Co-developed the e-commerce product finder and catalog framework for a premier Swiss building materials supplier. Maintained scalable search experiences over extensive product datasets.',
      tags: ['React', 'TypeScript', 'Next.js', 'SCSS', 'REST APIs'],
      demo: 'https://www.sabag.ch/de/innenausbau',
      accentColor: '#607456',
      svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#607456"/><text x="60" y="74" font-family="'Mouldy Cheese', sans-serif" font-weight="700" font-size="42" fill="#fff" text-anchor="middle">SC</text></svg>`,
    },
    {
      id: 3,
      number: '3',
      title: 'Hi Kids',
      systemType: 'Multilingual Educational SaaS',
      description: 'Interactive multilingual educational platform serving diverse user journeys with gamified learning. Built with Next.js 16 using server-side internationalization for global reach.',
      tags: ['Next.js 16', 'React 18', 'TypeScript', 'i18n', 'SSR'],
      github: 'https://github.com/esraamjdy',
      demo: 'https://hikids.net/en',
      accentColor: '#7B2525',
      svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#7B2525"/><text x="60" y="74" font-family="'Mouldy Cheese', sans-serif" font-weight="700" font-size="42" fill="#fff" text-anchor="middle">HK</text></svg>`,
    },
    {
      id: 4,
      number: '4',
      title: 'helvecura',
      systemType: 'Healthcare Staffing & Workflow Management System',
      description: 'Swiss healthcare and medical management platform streamlining medical professional placements, staffing workflows, and client management across healthcare organizations in Switzerland.',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Hasura / GraphQL'],
      demo: 'https://www.helvecura.ch/',
      accentColor: '#2C5E8A',
      svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#2C5E8A"/><text x="60" y="74" font-family="'Mouldy Cheese', sans-serif" font-weight="700" font-size="42" fill="#fff" text-anchor="middle">HC</text></svg>`,
    },
  ];

  const totalProjects = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      let idx = 0;
      if (v < 0.35) {
        idx = 0;
      } else if (v < 0.60) {
        idx = 1;
      } else if (v < 0.82) {
        idx = 2;
      } else {
        idx = 3;
      }
      setActiveIndex(idx);
    });
  }, [scrollYProgress]);

  const activeProject = projects[activeIndex] ?? projects[0];

  // Notify the particle system to form the active project number ("1", "2", "3", "4").
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const activeNum = activeProject?.number || '1';
    window.dispatchEvent(new CustomEvent('particles:setShape', {
      detail: {
        shape: 'text',
        text: activeNum,
        scale: 3.2,
        color: activeProject.accentColor,
      },
    }));
  }, [activeIndex, activeProject]);

  const scrollToProject = (idx: number) => {
    const safeIndex = Math.min(Math.max(idx, 0), totalProjects - 1);
    setActiveIndex(safeIndex);

    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight - window.innerHeight;
    const targetV = safeIndex === 0 ? 0.12 : (safeIndex === 1 ? 0.48 : (safeIndex === 2 ? 0.70 : 0.90));
    window.scrollTo({ top: top + targetV * height, behavior: 'smooth' });
  };;

  // Positions of each project on the arc (numbers shifted to the left inside the arc space)
  const arcRadius = 340;
  const innerNumberRadius = 70; // Shifted further left inside the arc
  const centerX = 120;
  const centerY = 310;
  const arcStart = -90;
  const arcEnd = 90;

  const itemSpacing = 45;

  const getProjectAngle = (index: number) => {
    const relativeIndex = index - activeIndex;
    return relativeIndex * itemSpacing;
  };
  return (
    <div
      id="work"
      ref={containerRef}
      style={{ height: `${(totalProjects + 1) * 100}vh` }}
      className="relative z-20 bg-[#0a0a0a] pointer-events-auto"
    >
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-auto">

        {/* Background ambient solid glow tint without gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ backgroundColor: `${activeProject.accentColor}08` }}
          transition={{ duration: 0.8 }}
        />

        <div className="h-full flex flex-col py-10 px-8 md:px-16 max-w-[1600px] mx-auto">

          {/* ── TOP BAR ─────────────────────────────────────────── */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold leading-none tracking-tight mb-4">
                <span className="text-[#EEE0CC]">Selected </span>
                <motion.span
                  animate={{ color: activeProject.accentColor }}
                  transition={{ duration: 0.6 }}
                >
                  Works
                </motion.span>
              </h2>
              <motion.div
                className="w-20 h-1 rounded-full"
                animate={{ backgroundColor: activeProject.accentColor }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* ── MAIN BODY ────────────────────────────────────────── */}
          <div className="flex-1 flex items-center gap-0">

            {/* ── LEFT: Minimal semicircle selector on the right side ───────────── */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 420, height: "620px", marginLeft: '-110px' }}
            >
              {/* Anchor element for 3D Particle Number */}
              <div
                id="project-particle-number-anchor"
                className="absolute pointer-events-none w-4 h-4"
                style={{
                  left: `${centerX + innerNumberRadius}px`,
                  top: `${centerY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <svg
                width="420"
                height="620"
                viewBox="0 0 420 620"
                className="overflow-visible"
              >
                {/* Arc */}
                <path
                  d={`
    M ${centerX + arcRadius * Math.cos((arcStart * Math.PI) / 180)}
      ${centerY + arcRadius * Math.sin((arcStart * Math.PI) / 180)}

    A ${arcRadius} ${arcRadius}
      0 0 1
      ${centerX + arcRadius * Math.cos((arcEnd * Math.PI) / 180)}
      ${centerY + arcRadius * Math.sin((arcEnd * Math.PI) / 180)}
  `}
                  fill="none"
                  stroke="rgba(255,255,255,.12)"
                  strokeWidth="1.2"
                />


                <motion.g>
                  {/* Subtle clickable dots for projects along the arc line */}
                  {projects.map((project, index) => {
                    const angle = getProjectAngle(index);
                    const rad = (angle * Math.PI) / 180;

                    const dotX = centerX + arcRadius * Math.cos(rad);
                    const dotY = centerY + arcRadius * Math.sin(rad);

                    const active = index === activeIndex;

                    return (
                      <g
                        key={project.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${project.title}`}
                        onClick={() => scrollToProject(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') scrollToProject(index);
                        }}
                        className="cursor-pointer pointer-events-auto group focus:outline-none"
                      >
                        {/* Generous hit area target */}
                        <circle cx={dotX} cy={dotY} r={18} fill="transparent" />
                        <motion.circle
                          cx={dotX}
                          cy={dotY}
                          animate={{ cx: dotX, cy: dotY, r: active ? 7 : 4 }}
                          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                          fill={active ? project.accentColor : 'rgba(255,255,255,.3)'}
                        />
                      </g>
                    );
                  })}

                </motion.g>
              </svg>
            </div>

            {/* Vertical divider */}


            {/* ── RIGHT: Project details — NO CARD ────────────── */}
            <div className="flex-1 min-w-0 pl-28 md:pl-40 xl:pl-56 max-w-[900px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {/* Title */}
                  <h3 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-[#EEE0CC] leading-[1.05] mb-3">
                    {activeProject.title}
                  </h3>

                  {/* System Type below title */}
                  <div className="flex items-center gap-2 text-sm font-mono mb-6">
                    <span className="text-gray-400">System:</span>
                    <span style={{ color: activeProject.accentColor }} className="font-semibold">
                      {activeProject.systemType}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mb-8">
                    {activeProject.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full text-gray-500 border border-gray-800/80 bg-gray-900/30 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA links */}
                  <div className="flex items-center gap-6">
                    <Link
                      href={activeProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm font-bold transition-all duration-300"
                      style={{ color: activeProject.accentColor }}
                    >
                      <span className="underline underline-offset-4 decoration-transparent group-hover:decoration-current transition-all">
                        View Live Demo
                      </span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    {activeProject.github && (
                      <Link
                        href={activeProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Source Code
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 z-30 relative">
            <div className="flex items-center gap-3">
              {projects.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToProject(idx)}
                  aria-label={`Go to project ${p.number}`}
                  className="flex items-center gap-2 py-2 px-3 rounded focus:outline-none group cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
                >
                  <div
                    className="h-1 rounded-full transition-all duration-500 group-hover:opacity-100"
                    style={{
                      width: idx === activeIndex ? '2.5rem' : '0.75rem',
                      background: idx === activeIndex ? p.accentColor : '#374151',
                      opacity: idx === activeIndex ? 1 : 0.5,
                    }}
                  />
                  {idx === activeIndex && (
                    <span className="text-xs font-mono text-gray-400 font-semibold">{p.number}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
