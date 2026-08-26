import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { ArrowCursor } from '@/components/ArrowCursor';
import { TimelineNav } from '@/components/TimelineNav';
import { ParticleQuestionMark } from '@/components/ParticleQuestionMark';

export default function Home() {
  return (
    <main className="relative z-20 bg-[#0a0a0a] text-[#EEE0CC]" style={{ overflowX: 'clip' }}>
      {/* Interactive Global Arrow Cursor Effect */}
      <ArrowCursor />

      {/* Professional Vertical Timeline Navigation Side Bar */}
      <TimelineNav />

      {/* Interactive Particle Question Mark -> Butterfly Morph */}
      <ParticleQuestionMark />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact />
    </main>
  );
}
