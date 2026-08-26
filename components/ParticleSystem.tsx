'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function generateQuestionMark(scale: number = 1) {
  const points: number[][] = [];

  // Top dot of question mark
  const topDotRadius = 0.3;
  const topDotDensity = 40;
  for (let i = 0; i < topDotDensity; i++) {
    const angle = (i / topDotDensity) * Math.PI * 2;
    const x = topDotRadius * Math.cos(angle);
    const y = 1.5 + topDotRadius * Math.sin(angle);
    points.push([x * scale, y * scale, 0]);
  }

  // Question mark curve (main body)
  const curveDensity = 150;
  for (let i = 0; i < curveDensity; i++) {
    const t = (i / curveDensity) * Math.PI * 2;
    const radius = 0.8;
    const x = radius * Math.cos(t);
    const y = 0.3 + radius * Math.sin(t);
    points.push([x * scale, y * scale, 0]);
  }

  // Bottom dot
  const bottomDotRadius = 0.2;
  const bottomDotDensity = 30;
  for (let i = 0; i < bottomDotDensity; i++) {
    const angle = (i / bottomDotDensity) * Math.PI * 2;
    const x = bottomDotRadius * Math.cos(angle);
    const y = -1.2 + bottomDotRadius * Math.sin(angle);
    points.push([x * scale, y * scale, 0]);
  }

  return points;
}

function generateButterflyShape(scale: number = 1) {
  const points: number[][] = [];
  
  for (let i = 0; i < 400; i++) {
    const angle = (i / 400) * Math.PI * 2;
    const t = angle;
    
    // Butterfly curve
    const x = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t)) * 0.2;
    const y = Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t)) * 0.2;
    
    points.push([x * scale, y * scale, 0]);
    
    // Mirror for butterfly wings
    if (i % 2 === 0) {
      points.push([-x * scale, y * scale, 0]);
    }
  }
  
  return points;
}

function generateCircleShape(scale: number = 1) {
  const points: number[][] = [];
  const circlePoints = 200;
  
  for (let i = 0; i < circlePoints; i++) {
    const angle = (i / circlePoints) * Math.PI * 2;
    const x = Math.cos(angle) * 1.2;
    const y = Math.sin(angle) * 1.2;
    points.push([x * scale, y * scale, 0]);
  }
  
  return points;
}

function ParticleCloud() {
  const meshRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const [targetShape, setTargetShape] = useState<number[][]>(generateQuestionMark(2));
  const [color, setColor] = useState(0xBA6A4C);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const { camera } = useThree();

  useEffect(() => {
    // Initial positions - random scattered
    const flatShape = targetShape.flat();
    const newPositions = new Float32Array(flatShape);
    
    // Randomly scatter initial positions
    for (let i = 0; i < newPositions.length; i += 3) {
      newPositions[i] = (Math.random() - 0.5) * 8;
      newPositions[i + 1] = (Math.random() - 0.5) * 8;
      newPositions[i + 2] = (Math.random() - 0.5) * 2;
    }

    positionsRef.current = newPositions;
    targetPositionsRef.current = new Float32Array(flatShape);

    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    }
  }, [targetShape]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = scrollTop / docHeight;

      // Change shape and color based on scroll
      if (scrollProgressRef.current < 0.25) {
        setTargetShape(generateQuestionMark(2));
        setColor(0xBA6A4C); // terracotta
      } else if (scrollProgressRef.current < 0.5) {
        setTargetShape(generateButterflyShape(2.5));
        setColor(0x607456); // sage green
      } else if (scrollProgressRef.current < 0.75) {
        setTargetShape(generateCircleShape(2));
        setColor(0xEEE0CC); // cream
      } else {
        setTargetShape(generateQuestionMark(1.8));
        setColor(0x7B2525); // deep burgundy
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(() => {
    if (!meshRef.current || !positionsRef.current || !targetPositionsRef.current) return;

    const positions = positionsRef.current;
    const targets = targetPositionsRef.current;

    for (let i = 0; i < positions.length; i += 3) {
      // Smooth lerp to target position
      const lerpSpeed = 0.08;
      positions[i] += (targets[i] - positions[i]) * lerpSpeed;
      positions[i + 1] += (targets[i + 1] - positions[i + 1]) * lerpSpeed;
      positions[i + 2] += (targets[i + 2] - positions[i + 2]) * lerpSpeed;

      // Mouse repulsion
      const dx = mousePosRef.current.x * 5 - positions[i];
      const dy = mousePosRef.current.y * 5 - positions[i + 1];
      const distSq = dx * dx + dy * dy;

      if (distSq < 4) {
        const dist = Math.sqrt(distSq);
        const force = (2 - dist) * 0.15;
        positions[i] -= (dx / (dist + 0.1)) * force;
        positions[i + 1] -= (dy / (dist + 0.1)) * force;
      }
    }

    const geometry = meshRef.current.geometry as THREE.BufferGeometry;
    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.08}
        color={color}
        sizeAttenuation={true}
        transparent
        opacity={0.9}
      />
    </points>
  );
}

export function ParticleSystem() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          precision: 'highp',
          powerPreference: 'high-performance',
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
