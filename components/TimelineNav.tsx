'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function TimelineNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate active section based on scroll position
      let currentActive = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Offset allows activation when section is comfortably in view
          if (rect.top <= window.innerHeight * 0.4) {
            currentActive = section.id;
          }
        }
      }
      setActiveSection(currentActive);

      // Calculate smooth overall timeline progress
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(Math.min(1, Math.max(0, scrollY / scrollHeight)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 pointer-events-none mix-blend-difference hidden sm:block">
      <div className="relative h-64 flex flex-col justify-between items-center w-10">
        {/* The Track Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-800/60 rounded-full" />

        {/* The Fill Line (Progress based on scroll) without gradient */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full origin-top"
          style={{
            backgroundColor: '#BA6A4C',
            height: '100%',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: progress }}
          transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.1 }}
        />

        {/* Nodes */}
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <div key={section.id} className="relative group pointer-events-auto cursor-pointer">
              <a
                href={`#${section.id}`}
                role="button"
                onClick={(e) => handleClick(e, section.id)}
                className="block p-3 cursor-pointer"
                aria-label={`Scroll to ${section.label}`}
              >
                {/* Visual Node */}
                <motion.div
                  className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                    isActive ? 'bg-[#BA6A4C] border-[#BA6A4C]' : 'bg-[#0a0a0a] border-gray-600'
                  }`}
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    boxShadow: isActive ? '0 0 12px rgba(186,106,76,0.6)' : '0 0 0px transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                />
              </a>

              {/* Tooltip Label */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                <span
                  className="text-sm font-semibold tracking-widest uppercase px-3 py-1 rounded-md"
                  style={{
                    color: isActive ? '#BA6A4C' : '#EEE0CC',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    border: '1px solid rgba(96, 116, 86, 0.3)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {section.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
