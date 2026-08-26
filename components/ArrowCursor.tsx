'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface PollenParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export function ArrowCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [particles, setParticles] = useState<PollenParticle[]>([]);

  const lastEmitRef = useRef(0);
  const prevPosRef = useRef({ x: -100, y: -100 });
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth position values for butterfly body
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 24, stiffness: 300, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Smooth position values for trailing glow ring
  const ringSpringConfig = { damping: 28, stiffness: 220, mass: 0.7 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!isVisible) setIsVisible(true);

      mouseX.set(x);
      mouseY.set(y);

      // Calculate direction angle
      const dx = x - prevPosRef.current.x;
      const dy = y - prevPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        setIsMoving(true);
        const movementAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        setAngle(movementAngle);

        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => setIsMoving(false), 200);

        // Spawn pollen sparkles faster and thicker
        const now = Date.now();
        if (now - lastEmitRef.current > 12) {
          lastEmitRef.current = now;

          const colors = ['#BA6A4C', '#EEE0CC', '#607456', '#7B2525'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const newId = Math.random().toString(36).substr(2, 9) + '-' + Date.now();

          setParticles((prev) => [
            ...prev.slice(-45), // keep max 45 particles for a longer trail
            {
              id: newId,
              x: x + (Math.random() - 0.5) * 16,
              y: y + (Math.random() - 0.5) * 16,
              size: Math.random() * 6 + 4, // bigger particles
              opacity: 1, // start at full opacity
              color: randomColor,
            },
          ]);
        }
      }

      prevPosRef.current = { x, y };

      // Check hover state on clickable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.nodeType === 1 &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (typeof target.closest === 'function' &&
            (target.closest('a') ||
              target.closest('button') ||
              target.closest('[role="button"]') ||
              target.closest('.cursor-pointer'))) ||
          (typeof target.getAttribute === 'function' && target.getAttribute('role') === 'button'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, [isVisible, mouseX, mouseY]);

  // Fade pollen dust
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            // Fade slower and shrink slower to make trail longer
            opacity: p.opacity - 0.02,
            size: p.size * 0.96,
          }))
          .filter((p) => p.opacity > 0.02)
      );
    }, 25);

    return () => clearInterval(timer);
  }, [particles]);

  if (!isVisible) return null;

  const flapSpeed = isHovered ? 0.25 : isMoving ? 0.35 : 0.8;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-75"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            rotate: angle,
            scale: isHovered ? 1.15 : 1,
            y: [0, -6, 0, -4, 0],
            x: [0, 2, 0, -2, 0],
          }}
          transition={{
            rotate: {
              type: "spring",
              stiffness: 250,
              damping: 18,
            },
            scale: {
              type: "spring",
              stiffness: 300,
            },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src="/pngwing.com.png"
            alt=""
            width={55}
            height={55}
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
