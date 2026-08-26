'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import type { IconType } from 'react-icons/lib';
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiMui,
  SiTailwindcss,
  SiJest,
  SiExpo,
} from 'react-icons/si';

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // This controls the vertical space during which
  // Web → Mobile moves horizontally.
  const horizontalRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 0,
      title: 'Web Development',
      particleText: 'WEB',
      subtitle: 'Modern Web Architecture & Responsive UI',
      icon: '🌐',
      accentColor: '#BA6A4C',
      description:
        'Building scalable, type-safe, and highly performant web platforms using Next.js 14, React, TypeScript, and modern styling frameworks.',
      skills: [
        'React',
        'Next.js 14',
        'TypeScript',
        'JavaScript (ES6+)',
        'Tailwind CSS',
        'Material UI (MUI)',
        'HTML5 & CSS3',
        'REST APIs',
        'GraphQL',
        'Web Performance & SEO',
      ],
    },
    {
      id: 1,
      title: 'Mobile Development',
      particleText: 'MOBILE',
      subtitle: 'Cross-Platform Native Apps & Mobile UX',
      icon: '📱',
      accentColor: '#BA6A4C',
      description:
        'Crafting intuitive cross-platform mobile experiences for iOS and Android using React Native and Expo with responsive touch interactions.',
      skills: [
        'React Native',
        'Expo Framework',
        'iOS & Android Apps',
        'Mobile UI/UX Design',
        'Native Device APIs',
        'AsyncStorage & Offline Sync',
        'Mobile State & Navigation',
        'Jest & Mobile Testing',
      ],
    },
  ];

  /*
   * Scroll mapping for sticky section:
   * h-[250vh] with stable parking zones:
   *   0.00 – 0.35 → Stable parked on Web (0%)
   *   0.35 – 0.65 → Smooth transition to Mobile (-50%)
   *   0.65 – 1.00 → Stable parked on Mobile (-50%)
   */
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
    offset: ['start start', 'end end'],
  });

  // x is kept only to satisfy any lingering refs; skills are now fade-switched, not slide-switched
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);

  /*
   * Change active category according to horizontal position.
   */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const nextCategory = progress >= 0.5 ? 1 : 0;

      setActiveCategory((current) =>
        current === nextCategory ? current : nextCategory
      );
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  /*
   * Update particles when Web / Mobile changes.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const category = categories[activeCategory];

    if (!category) return;

    window.dispatchEvent(
      new CustomEvent('particles:setShape', {
        detail: {
          shape: 'text',
          text: category.particleText,
          scale: 2.5,
          color: category.accentColor,
        },
      })
    );
  }, [activeCategory]);

  return (
    <section
      id="about"
      ref={horizontalRef}
      className="relative z-20 bg-[#0a0a0a] pointer-events-auto h-[250vh]"
    >
      {/* 
        EVERYTHING inside this sticky container stays
        inside the same viewport while the user scrolls.
      */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ─────────────────────────────────────────────
            ABOUT CONTENT
        ───────────────────────────────────────────── */}

        <div className="h-full flex flex-col">

          {/* TOP SECTION */}
          <div className="max-w-[100rem] w-full mx-auto px-8 md:px-16 lg:px-24 pt-10 lg:pt-14 flex-shrink-0">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Section Title */}
              <div className="mb-5">
                <h2 className="text-5xl md:text-6xl font-bold mb-4">
                  <span style={{ color: '#BA6A4C' }}>
                    About
                  </span>

                  <span className="text-gray-500">
                    {' '}
                    Me
                  </span>
                </h2>

                <div
                  className="w-20 h-1 rounded-full"
                  style={{
                    background: '#BA6A4C',
                  }}
                />
              </div>

              {/* CV */}
              <div
                id="cv-download-anchor"
                className="flex items-center justify-center gap-6 py-5"
              >
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EEE0CC] tracking-wide text-center">
                  Have a look at my CV
                </p>

                <a
                  id="cv-icon-anchor"
                  href="/Esraa_s_Resume.pdf"
                  download="Esraa_s_Resume.pdf"
                  className="group inline-flex items-center text-[#BA6A4C] hover:text-[#EEE0CC] transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
                  title="Download CV"
                  aria-label="Download CV"
                >
                  <svg
                    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-transform duration-300 group-hover:translate-y-1 drop-shadow-[0_0_15px_rgba(186,106,76,0.5)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>



          {/* ─────────────────────────────────────────────
              HORIZONTAL WEB / MOBILE AREA

              This takes the remaining space in the viewport.
          ───────────────────────────────────────────── */}

          <div className="flex-1 min-h-0 overflow-hidden relative">

            {/* ─── TITLE ANCHOR (click to toggle) ─────────────────────── */}
            <div className="absolute inset-x-0 top-0 z-20 pt-36 pointer-events-none">
              <div id="category-particle-anchor" className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24">
                <div className="relative h-20 flex items-center justify-center">

                  {/* Always-visible click target — toggling between 0 and 1 */}
                  <div
                    id={activeCategory === 0 ? 'web-category-anchor' : 'mobile-category-anchor'}
                    className="absolute inset-0 cursor-pointer pointer-events-auto"
                    onClick={() => setActiveCategory(prev => prev === 0 ? 1 : 0)}
                    title={activeCategory === 0 ? 'Switch to Mobile' : 'Switch to Web'}
                    aria-label={activeCategory === 0 ? 'Web Development — click to switch to Mobile' : 'Mobile Development — click to switch to Web'}
                  />

                  {/* Hidden anchor for the inactive category so ParticleQuestionMark can find it */}
                  <div
                    id={activeCategory === 0 ? 'mobile-category-anchor' : 'web-category-anchor'}
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden
                  />

                </div>
              </div>
            </div>

            {/* ─── SKILLS PANEL (fade in/out with category) ───────────── */}
            <div className="relative h-full w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center"
                >
                  <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 w-full">
                    <div className="flex flex-wrap gap-5 pt-36">
                      {categories[activeCategory].skills.map((skill, sIdx) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.22, delay: sIdx * 0.04 }}
                          className="px-5 py-3 rounded-xl bg-[#18181b] border border-gray-800 text-[#EEE0CC] font-semibold text-sm md:text-base hover:border-[#BA6A4C] hover:bg-[#BA6A4C]/10 transition-all duration-300 cursor-default flex items-center gap-3"
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: categories[activeCategory].accentColor }}
                          />
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
          {/* ─────────────────────────────────────────────
              MARQUEE — icon pills
          ───────────────────────────────────────────── */}

          <div className="relative overflow-hidden flex items-center w-[100vw] left-1/2 -ml-[50vw] mt-16 mb-14 flex-shrink-0">
            {/* fade edges */}
            <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }} />
            <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }} />
            <motion.div
              className="flex items-center gap-14 px-4"
              animate={{ x: ['0%', '-25%'] }}
              transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
            >
              {([
                { label: 'React', Icon: SiReact, color: '#61DAFB' },
                { label: 'Next.js', Icon: SiNextdotjs, color: '#EEE0CC' },
                { label: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
                { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
                { label: 'Material UI', Icon: SiMui, color: '#007FFF' },
                { label: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
                { label: 'React Native', Icon: SiReact, color: '#61DAFB' },
                { label: 'Jest', Icon: SiJest, color: '#C21325' },
                { label: 'Expo', Icon: SiExpo, color: '#EEE0CC' },
                { label: 'React', Icon: SiReact, color: '#61DAFB' },
                { label: 'Next.js', Icon: SiNextdotjs, color: '#EEE0CC' },
                { label: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
                { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
                { label: 'Material UI', Icon: SiMui, color: '#007FFF' },
                { label: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
                { label: 'React Native', Icon: SiReact, color: '#61DAFB' },
                { label: 'Jest', Icon: SiJest, color: '#C21325' },
                { label: 'Expo', Icon: SiExpo, color: '#EEE0CC' },
                { label: 'React', Icon: SiReact, color: '#61DAFB' },
                { label: 'Next.js', Icon: SiNextdotjs, color: '#EEE0CC' },
                { label: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
                { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
                { label: 'Material UI', Icon: SiMui, color: '#007FFF' },
                { label: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
                { label: 'React Native', Icon: SiReact, color: '#61DAFB' },
                { label: 'Jest', Icon: SiJest, color: '#C21325' },
                { label: 'Expo', Icon: SiExpo, color: '#EEE0CC' },
                { label: 'React', Icon: SiReact, color: '#61DAFB' },
                { label: 'Next.js', Icon: SiNextdotjs, color: '#EEE0CC' },
                { label: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
                { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
                { label: 'Material UI', Icon: SiMui, color: '#007FFF' },
                { label: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
                { label: 'React Native', Icon: SiReact, color: '#61DAFB' },
                { label: 'Jest', Icon: SiJest, color: '#C21325' },
                { label: 'Expo', Icon: SiExpo, color: '#EEE0CC' },
              ] as { label: string; Icon: IconType; color: string }[]).map(({ label, Icon, color }, index) => (
                <Icon
                  key={index}
                  title={label}
                  className="opacity-65 hover:opacity-100 hover:scale-125 transition-all duration-200 cursor-pointer flex-shrink-0"
                  style={{ color, fontSize: '3.2rem' }}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
