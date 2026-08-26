'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiMail, FiGithub, FiLinkedin, FiCopy, FiCheck } from 'react-icons/fi';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('esraamjdy7@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const logos = [
    {
      name: 'Email',
      url: 'mailto:esraamjdy7@gmail.com',
      icon: FiMail,
      hoverColor: '#BA6A4C',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/esraamjdy',
      icon: FiGithub,
      hoverColor: '#EEE0CC',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/esraamjdy/',
      icon: FiLinkedin,
      hoverColor: '#607456',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" ref={ref} className="relative z-20 pt-12 pb-44 px-6 bg-[#0a0a0a] pointer-events-auto">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Title */}
          <motion.div className="mb-12 text-center relative" variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: '#3B82F6' }}>Let&apos;s</span>
              <span className="text-gray-500"> Connect</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have a vision, an ambitious project, or an exciting opportunity? Let&apos;s build something remarkable.
            </p>
            <div className="w-20 h-1 rounded-full mx-auto mt-4" style={{ background: '#3B82F6' }}></div>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Contact Info */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Get in Touch
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Whether you have a detailed project brief or simply want to explore new possibilities, 
                  my inbox is always open. Reach out through any of these direct channels.
                </p>
              </div>

              <div className="space-y-6">
                {/* Line 1: Copyable Written Email */}
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Direct Email</p>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Click to copy email address"
                    className="group inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-200 hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
                  >
                    <span>esraamjdy7@gmail.com</span>
                    {copied ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#3B82F6] text-white font-medium tracking-wide">
                        <FiCheck className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <FiCopy className="w-5 h-5 text-gray-500 group-hover:text-[#3B82F6] transition-colors opacity-70 group-hover:opacity-100" />
                    )}
                  </button>
                </div>

                {/* Line 2: 3 Logos on the same line without any borders */}
                <div className="flex items-center gap-6 pt-2">
                  {[
                    { name: 'Email', url: 'mailto:esraamjdy7@gmail.com', icon: FiMail, hoverColor: '#3B82F6' },
                    { name: 'GitHub', url: 'https://github.com/esraamjdy', icon: FiGithub, hoverColor: '#60A5FA' },
                    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/esraamjdy/', icon: FiLinkedin, hoverColor: '#0077B5' },
                  ].map((logo) => (
                    <a
                      key={logo.name}
                      href={logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={logo.name}
                      className="text-gray-400 text-3xl transition-all duration-300 hover:scale-125 cursor-pointer"
                      style={{ border: 'none', background: 'none' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = logo.hoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9ca3af';
                      }}
                    >
                      <logo.icon />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              className="space-y-4 bg-gray-900/40 p-6 md:p-8 rounded-2xl border border-gray-800/60"
              variants={itemVariants}
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                    placeholder="Your Name"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      borderColor: focusedField === 'name' ? '#3B82F6' : undefined,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                    placeholder="Your Email"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      borderColor: focusedField === 'email' ? '#3B82F6' : undefined,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 text-sm focus:outline-none focus:border-gray-600 transition-colors resize-none h-24"
                  placeholder="Your message..."
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    borderColor: focusedField === 'message' ? '#3B82F6' : undefined,
                  }}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md cursor-pointer active:scale-95 text-white"
                style={{
                  backgroundColor: submitted ? '#10B981' : '#3B82F6',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </motion.button>

              {submitted ? (
                <p className="text-xs text-[#10B981] text-center font-medium">
                  Thank you! Your message has been sent successfully.
                </p>
              ) : (
                <p className="text-xs text-gray-500 text-center">
                  I&apos;ll get back to you within 24 hours
                </p>
              )}
            </motion.form>
          </div>

          {/* Footer */}
          <motion.div
            className="border-t border-gray-800 pt-8 pb-10 text-center relative"
            variants={itemVariants}
          >
            <div id="contact-particle-anchor" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 pointer-events-none" />
            <p className="text-gray-500 text-sm">
              © 2024 Esraa Magdy. Built with passion & precision.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
