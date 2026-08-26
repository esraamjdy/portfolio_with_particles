'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, RootState } from '@react-three/fiber';
import * as THREE from 'three';

function generateTextGeometry(text: string, scale: number = 1): { points: number[][]; edges: number[] } | null {
  const points: number[][] = [];
  const edges: number[] = [];

  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 130px "Mouldy Cheese", sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const step = 2;

  let minX = canvas.width;
  let maxX = 0;
  let minY = canvas.height;
  let maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4;
      if (data[index] > 128) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) return null;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2 + 3;
  const pixelScale = 1.8 / (maxY - minY || 1);

  for (let y = step; y < canvas.height - step; y += step) {
    for (let x = step; x < canvas.width - step; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx] > 128) {
        const up = data[((y - step) * canvas.width + x) * 4];
        const down = data[((y + step) * canvas.width + x) * 4];
        const left = data[(y * canvas.width + (x - step)) * 4];
        const right = data[(y * canvas.width + (x + step)) * 4];

        const isEdge = (up < 128 || down < 128 || left < 128 || right < 128) ? 1 : 0;

        for (let i = 0; i < 3; i++) {
          const cx = (x - centerX) * pixelScale;
          const cy = -(y - centerY) * pixelScale;
          const jx = (Math.random() - 0.5) * 0.08;
          const jy = (Math.random() - 0.5) * 0.08;
          const jz = (Math.random() - 0.5) * 0.25;
          points.push([(cx + jx) * scale, (cy + jy) * scale, jz * scale]);
          edges.push(isEdge);
        }
      }
    }
  }

  return { points, edges };
}

function generateArrowFromSVG(targetCount: number, scale: number = 2.3): number[][] {
  if (typeof document === 'undefined') return [];

  const canvas = document.createElement('canvas');
  const size = 320;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';

  if (typeof Path2D !== 'undefined') {
    const arrowPath = new Path2D(
      "M 60 40 L 230 150 L 155 165 L 205 245 C 210 253 205 263 195 268 L 165 282 C 155 287 145 282 140 272 L 115 185 L 50 210 Z"
    );

    ctx.fill(arrowPath);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(arrowPath);
  }

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const step = 2;

  let minX = size, maxX = 0, minY = size, maxY = 0, hasPixels = false;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      if (data[(y * size + x) * 4] > 100) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) return [];

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const pixelScale = 2.2 / (maxY - minY || 1);

  const angle = 0.70;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const rawPoints: number[][] = [];
  for (let y = step; y < size - step; y += step) {
    for (let x = step; x < size - step; x += step) {
      if (data[(y * size + x) * 4] > 100) {
        const cx = (x - centerX) * pixelScale;
        const cy = -(y - centerY) * pixelScale;

        const rx = cx * cosA - cy * sinA;
        const ry = cx * sinA + cy * cosA;

        rawPoints.push([rx * scale, ry * scale, (Math.random() - 0.5) * 0.1]);
      }
    }
  }

  const matchedPoints: number[][] = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.floor(Math.random() * rawPoints.length);
    const p = rawPoints[idx] || [0, 0, 0];
    matchedPoints.push([
      p[0] + (Math.random() - 0.5) * 0.02,
      p[1] + (Math.random() - 0.5) * 0.02,
      p[2] + (Math.random() - 0.5) * 0.04
    ]);
  }

  return matchedPoints;
}

function generateFooterGradientBarrier(targetCount: number): number[][] {
  const points: number[][] = [];
  const floorBandCount = Math.floor(targetCount * 0.65); // 65% ultra-dense at the very bottom
  const gradientCount = targetCount - floorBandCount;    // 35% gradient fade upward

  // Band 1: ultra-dense floor band — tightly packed at the very bottom
  for (let i = 0; i < floorBandCount; i++) {
    const x = (Math.random() - 0.5) * 62;
    // Very narrow y range near the floor: -8.0 to -6.0
    const y = -8.0 + Math.random() * 2.0;
    const z = (Math.random() - 0.5) * 6.5;
    points.push([x, y, z]);
  }

  // Band 2: sparse gradient fading upward — pow(3) still bottom-weighted
  for (let i = 0; i < gradientCount; i++) {
    const x = (Math.random() - 0.5) * 58;
    const normalizedY = Math.pow(Math.random(), 3);
    const y = -6.0 + normalizedY * 5.0; // from -6.0 fading up to -1.0
    const z = (Math.random() - 0.5) * 5.5;
    points.push([x, y, z]);
  }

  return points;
}

function generateSvgText(text: string, targetCount: number): number[][] {
  if (typeof document === 'undefined') return [];

  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 140;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '800 64px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const step = 2;

  let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0, hasPixels = false;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 100) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) return [];

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  // Normalize Y height to 1.0 unit so runtime scale dynamically matches DOM h3 text height!
  const pixelScale = 1.0 / (maxY - minY || 1);

  const raw: number[][] = [];
  for (let y = step; y < canvas.height - step; y += step) {
    for (let x = step; x < canvas.width - step; x += step) {
      if (data[(y * canvas.width + x) * 4] > 100) {
        const cx = (x - centerX) * pixelScale;
        const cy = -(y - centerY) * pixelScale;
        raw.push([cx, cy, (Math.random() - 0.5) * 0.08]);
      }
    }
  }

  const out: number[][] = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.floor(Math.random() * raw.length);
    const p = raw[idx] || [0, 0, 0];
    out.push([
      p[0] + (Math.random() - 0.5) * 0.015,
      p[1] + (Math.random() - 0.5) * 0.015,
      p[2] + (Math.random() - 0.5) * 0.03
    ]);
  }

  return out;
}

function generateCircleFromCount(count: number, scale: number = 1.8): number[][] {
  const points: number[][] = [];
  const radius = 1.2 * scale;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (Math.random() - 0.5) * 0.2;
    points.push([x, y, z]);
  }
  return points;
}

function generateFromPathD(pathD: string, targetCount: number, scale: number = 2): number[][] {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 240;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const p = new Path2D(pathD);
    ctx.fillStyle = 'white';
    ctx.fill(p);
  } catch (err) {
    return [];
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const step = 2;

  let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0, has = false;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 128) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        has = true;
      }
    }
  }

  if (!has) return [];

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const pixelScale = 1.8 / (maxY - minY || 1);

  const raw: number[][] = [];
  for (let y = step; y < canvas.height - step; y += step) {
    for (let x = step; x < canvas.width - step; x += step) {
      if (data[(y * canvas.width + x) * 4] > 128) {
        const cx = (x - centerX) * pixelScale;
        const cy = -(y - centerY) * pixelScale;
        raw.push([cx * scale + (Math.random() - 0.5) * 0.02, cy * scale + (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.08]);
      }
    }
  }

  const out: number[][] = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.floor(Math.random() * raw.length);
    out.push(raw[idx] || [0, 0, 0]);
  }
  return out;
}

function generateTextTargets(text: string, targetCount: number, scale: number = 2.2): number[][] {
  if (typeof document === 'undefined') return [];

  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 240;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const fontSize = text.length === 1 ? 160 : text.length === 2 ? 110 : text.length <= 4 ? 90 : 70;
  const isThin = text === '3' || text === '4';
  const strokeW = isThin ? 2 : 12;

  ctx.font = `bold ${fontSize}px "Mouldy Cheese", sans-serif`;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = strokeW;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  if (!isThin) {
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const step = 2;

  let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0, hasPixels = false;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 100) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) {
    // Mouldy Cheese may not be loaded yet — retry with system-ui as guaranteed fallback
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = strokeW;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    if (!isThin) {
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    }

    const retryData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let retryHas = false;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        if (retryData[(y * canvas.width + x) * 4] > 100) {
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
          retryHas = true;
        }
      }
    }
    if (!retryHas) {
      return Array.from({ length: targetCount }, () => [
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.1,
      ]);
    }
    // Use fallback data
    const centerXf = (minX + maxX) / 2;
    const centerYf = (minY + maxY) / 2;
    const pixelScaleF = scale / (maxY - minY || 1);
    const rawF: number[][] = [];
    for (let y = step; y < canvas.height - step; y += step) {
      for (let x = step; x < canvas.width - step; x += step) {
        if (retryData[(y * canvas.width + x) * 4] > 100) {
          rawF.push([(x - centerXf) * pixelScaleF, -(y - centerYf) * pixelScaleF, (Math.random() - 0.5) * 0.1]);
        }
      }
    }
    const outF: number[][] = [];
    for (let i = 0; i < targetCount; i++) {
      const idx = Math.floor(Math.random() * rawF.length);
      const p = rawF[idx] || [0, 0, 0];
      outF.push([p[0] + (Math.random() - 0.5) * 0.02, p[1] + (Math.random() - 0.5) * 0.02, p[2] + (Math.random() - 0.5) * 0.04]);
    }
    return outF;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const pixelScale = scale / (maxY - minY || 1);

  const raw: number[][] = [];
  for (let y = step; y < canvas.height - step; y += step) {
    for (let x = step; x < canvas.width - step; x += step) {
      if (data[(y * canvas.width + x) * 4] > 100) {
        const cx = (x - centerX) * pixelScale;
        const cy = -(y - centerY) * pixelScale;
        raw.push([cx, cy, (Math.random() - 0.5) * 0.1]);
      }
    }
  }

  if (raw.length === 0) {
    return Array.from({ length: targetCount }, () => [
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 0.1,
    ]);
  }

  const out: number[][] = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.floor(Math.random() * raw.length);
    const p = raw[idx] || [0, 0, 0];
    out.push([
      p[0] + (Math.random() - 0.5) * 0.02,
      p[1] + (Math.random() - 0.5) * 0.02,
      p[2] + (Math.random() - 0.5) * 0.04
    ]);
  }
  return out;
}

function ParticleQuestion() {
  const circleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.beginPath();
    context.arc(16, 16, 16, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);

  const meshRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const questionTargetsRef = useRef<Float32Array | null>(null);
  const butterflyTargetsRef = useRef<Float32Array | null>(null);
  const catTargetsRef = useRef<Float32Array | null>(null);
  const currentTargetsRef = useRef<Float32Array | null>(null);
  const contactTargetsRef = useRef<Float32Array | null>(null);
  const edgesRef = useRef<number[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const formationProgressRef = useRef(0);
  const scrollRef = useRef(0);
  const scatterSeedsRef = useRef<Float32Array | null>(null);
  const projectMorphRef = useRef(0);
  const contactMorphRef = useRef(0);
  const activeCategoryRef = useRef(0); // 0 for Web, 1 for Mobile
  const currentCategoryPosRef = useRef({ x: 0, y: 0 });
  // 0 = settled. Driven 0→1 on category switch: 0-0.5 scatter out, 0.5-1 reform in.
  const catTransitionRef = useRef(0);
  // Seeds for the title scatter burst — random offsets in local particle space
  const catScatterSeedsRef = useRef<Float32Array | null>(null);

  const { gl } = useThree();
  const [matColor, setMatColor] = useState('#BA6A4C');

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const about = document.getElementById('about');
      const projects = document.getElementById('work');
      const contact = document.getElementById('contact');
      const scrollY = window.scrollY;
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;

      const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));
      scrollRef.current = progress;

      if (about && projects) {
        const aboutBottom = about.offsetTop + about.offsetHeight;
        const projectsStart = projects.offsetTop;
        const transitionStart = aboutBottom - window.innerHeight * 0.9;
        const transitionEnd = projectsStart + window.innerHeight * 0.5;
        const range = Math.max(500, transitionEnd - transitionStart);
        const p = Math.min(1, Math.max(0, (scrollY - transitionStart) / range));
        projectMorphRef.current = p;
      } else {
        projectMorphRef.current = 0;
      }

      if (projects && contact) {
        const projectsBottom = projects.offsetTop + projects.offsetHeight;
        const contactStart = contact.offsetTop;
        const transitionStart = projectsBottom - window.innerHeight * 1.3;
        const transitionEnd = contactStart + window.innerHeight * 0.3;
        const range = Math.max(400, transitionEnd - transitionStart);
        const p = Math.min(1, Math.max(0, (scrollY - transitionStart) / range));
        contactMorphRef.current = p;
      } else {
        contactMorphRef.current = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (questionTargetsRef.current) return;

    const result = generateTextGeometry('?', 2.3);
    if (!result || result.points.length === 0) return;

    edgesRef.current = result.edges;

    const count = result.points.length;
    const halfCount = Math.floor(count / 2);
    const flatQ = result.points.flat();

    // First half forms Pointer Arrow pointing to CV button
    const butterflyPoints = generateArrowFromSVG(count, 0.85);
    const flatB = butterflyPoints.flat();

    // Second half forms 3D text word aligned over DOM text ("WEB" by default) with matching scale
    const initialCatPts = generateSvgText('WEB', halfCount);
    catTargetsRef.current = new Float32Array(initialCatPts.flat());

    // Default "1" number targets for Projects section
    const defaultNumberPts = generateTextTargets('1', count, 3.2);
    const flatNum = defaultNumberPts.flat();
    currentTargetsRef.current = new Float32Array(flatNum);

    // Bottom gradient barrier targets for Contact / Footer section
    const barrierPts = generateFooterGradientBarrier(count);
    contactTargetsRef.current = new Float32Array(barrierPts.flat());

    const newPositions = new Float32Array(flatQ);

    for (let i = 0; i < newPositions.length; i += 3) {
      const radius = 25 + Math.random() * 35;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);

      newPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      newPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      newPositions[i + 2] = radius * Math.cos(phi);
    }

    positionsRef.current = newPositions;
    questionTargetsRef.current = new Float32Array(flatQ);
    butterflyTargetsRef.current = new Float32Array(flatB);
    formationProgressRef.current = 0;

    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 50 + Math.random() * 80;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      seeds[i] = radius * Math.sin(phi) * Math.cos(theta);
      seeds[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      seeds[i + 2] = radius * Math.cos(phi);
    }
    scatterSeedsRef.current = seeds;

    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    }
  }, []);

  // Listen for particle shape / active category updates
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const shape = detail.shape || 'question';
      const scale = detail.scale ?? 1.6;
      const color = detail.color || matColor;

      if (!questionTargetsRef.current) return;

      // Don't let About/Projects override the particle color while in Contact section
      if (contactMorphRef.current > 0.5) return;

      const count = Math.floor(questionTargetsRef.current.length / 3) || 400;
      const halfCount = Math.floor(count / 2);

      // Category switching (About section): update catTargetsRef ONLY, don't touch currentTargetsRef
      if (detail.text === 'MOBILE' || detail.text === 'WEB') {
        const newCat = detail.text === 'MOBILE' ? 1 : 0;
        const catPts = generateSvgText(detail.text, Math.floor((questionTargetsRef.current?.length ?? 0) / 3 / 2));
        catTargetsRef.current = new Float32Array(catPts.flat());

        if (newCat !== activeCategoryRef.current) {
          // Generate fresh scatter seeds for title particles in LOCAL particle-space coords
          const halfN = catPts.length;
          const seeds = new Float32Array(halfN * 3);
          for (let s = 0; s < halfN * 3; s += 3) {
            const r = 1.2 + Math.random() * 1.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            seeds[s]     = r * Math.sin(phi) * Math.cos(theta);
            seeds[s + 1] = r * Math.sin(phi) * Math.sin(theta);
            seeds[s + 2] = r * Math.cos(phi) * 0.3;
          }
          catScatterSeedsRef.current = seeds;
          catTransitionRef.current = 0.001; // kick-start the animation
        }

        activeCategoryRef.current = newCat;
        if (meshRef.current && meshRef.current.material) {
          const mat = meshRef.current.material as THREE.PointsMaterial;
          mat.color.set(color);
        }
        setMatColor(color);
        return;
      }

      // For project number shapes ('1','2','3') or any other shape: update currentTargetsRef
      let pts: number[][] = [];

      if (shape === 'text' && detail.text) {
        pts = generateTextTargets(detail.text, count, scale);
      } else if (shape === 'question') {
        pts = Array.from(questionTargetsRef.current || []).reduce<number[][]>((acc, val, idx, arr) => {
          if (idx % 3 === 0) acc.push([arr[idx], arr[idx + 1], arr[idx + 2]]);
          return acc;
        }, []);
      } else if (shape === 'butterfly' || shape === 'arrow') {
        pts = Array.from(butterflyTargetsRef.current || []).reduce<number[][]>((acc, val, idx, arr) => {
          if (idx % 3 === 0) acc.push([arr[idx], arr[idx + 1], arr[idx + 2]]);
          return acc;
        }, []);
      } else if (shape === 'circle') {
        pts = generateCircleFromCount(count, scale);
      } else if (shape === 'svg' && detail.path) {
        pts = generateFromPathD(detail.path, count, scale);
      }

      if (!pts || pts.length === 0) return;

      const flat = new Float32Array(pts.flat());
      currentTargetsRef.current = flat;

      if (meshRef.current && meshRef.current.material) {
        const mat = meshRef.current.material as THREE.PointsMaterial;
        mat.color.set(color);
      }
      setMatColor(color);
    };

    window.addEventListener('particles:setShape', handler as EventListener);
    return () => window.removeEventListener('particles:setShape', handler as EventListener);
  }, [matColor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = gl.domElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePosRef.current = {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gl.domElement]);

  useFrame((state: RootState) => {
    if (
      !meshRef.current ||
      !positionsRef.current ||
      !questionTargetsRef.current ||
      !butterflyTargetsRef.current
    ) return;

    const time = state.clock.elapsedTime;
    const morphT = scrollRef.current;
    const projectMorphT = projectMorphRef.current;
    const contactMorphT = contactMorphRef.current;
    const { viewport } = state;

    // Drive category transition animation (0 → 1 over ~60 frames)
    if (catTransitionRef.current > 0 && catTransitionRef.current < 1) {
      catTransitionRef.current = Math.min(1, catTransitionRef.current + 0.022);
    }
    const catT = catTransitionRef.current;

    const scatterAmount = Math.sin(projectMorphT * Math.PI);
    const scatterEased = scatterAmount * scatterAmount;

    const floatY = Math.sin(time * 1.5) * 0.05;

    if (meshRef.current) {
      const currentScale = 0.30 * (1 - morphT) + (0.45 * (1 - projectMorphT) + (0.35 * (1 - contactMorphT) + 0.45 * contactMorphT) * projectMorphT) * morphT;
      meshRef.current.scale.set(currentScale, currentScale, currentScale);

      meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.12 * contactMorphT;
      meshRef.current.rotation.y = Math.cos(time * 0.6) * 0.18 * contactMorphT;

      let hero3DX = 1.8;
      let hero3DY = 0.05;
      let about3DX = 0;
      let about3DY = 0;
      let project3DX = 0;
      let project3DY = 0;
      let contact3DX = 0;
      let contact3DY = 0;

      if (typeof document !== 'undefined') {
        const heroAnchor = document.getElementById('hero-question-anchor');
        if (heroAnchor) {
          const rect = heroAnchor.getBoundingClientRect();
          const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
          const ndcY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
          hero3DX = (ndcX * viewport.width) / 2 + 0.2;
          hero3DY = (ndcY * viewport.height) / 2;
        }

        const iconAnchor = document.getElementById('cv-icon-anchor') || document.getElementById('cv-download-anchor') || document.getElementById('about');
        if (iconAnchor) {
          const rect = iconAnchor.getBoundingClientRect();
          const targetX = rect.right + (window.innerWidth > 768 ? 105 : 45);
          const targetY = rect.top + rect.height / 2 + (window.innerWidth > 768 ? 30 : 10);
          const ndcX = (targetX / window.innerWidth) * 2 - 1;
          const ndcY = -(targetY / window.innerHeight) * 2 + 1;
          about3DX = (ndcX * viewport.width) / 2;
          about3DY = (ndcY * viewport.height) / 2;
        }

        const projectAnchor = document.getElementById('project-particle-number-anchor') || document.getElementById('work');
        if (projectAnchor) {
          const rect = projectAnchor.getBoundingClientRect();
          const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
          const ndcY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
          project3DX = (ndcX * viewport.width) / 2;
          project3DY = (ndcY * viewport.height) / 2;
        }

        const contactAnchor = document.getElementById('contact-particle-anchor') || document.getElementById('contact');
        if (contactAnchor) {
          const rect = contactAnchor.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2 + (window.innerWidth > 768 ? 160 : 0);
          const targetY = rect.top + rect.height / 2;
          const ndcX = (targetX / window.innerWidth) * 2 - 1;
          const ndcY = -(targetY / window.innerHeight) * 2 + 1;
          contact3DX = (ndcX * viewport.width) / 2;
          contact3DY = (ndcY * viewport.height) / 2;
        }

        const handoffProjectsToContactX = project3DX * (1 - contactMorphT) + contact3DX * contactMorphT;
        const handoffProjectsToContactY = project3DY * (1 - contactMorphT) + contact3DY * contactMorphT;

        const handoffX = about3DX * (1 - projectMorphT) + handoffProjectsToContactX * projectMorphT;
        const handoffY = about3DY * (1 - projectMorphT) + handoffProjectsToContactY * projectMorphT;
        const currentX = hero3DX * (1 - morphT) + handoffX * morphT;
        const currentY = hero3DY * (1 - morphT) + handoffY * morphT + floatY;
        meshRef.current.position.set(currentX, currentY, 0);
      }

      if (meshRef.current.material) {
        const mat = meshRef.current.material as THREE.PointsMaterial;
        const baseSize = 0.035 * (1 - projectMorphT) + 0.052 * projectMorphT;
        mat.size = baseSize * (1 - contactMorphT) + 0.048 * contactMorphT;
        const opacityDip = 1 - (scatterEased * 0.2 + Math.sin(contactMorphT * Math.PI) * 0.25);
        mat.opacity = 0.95 * opacityDip;

        // Smoothly transition particle color to vibrant blue (#3B82F6) in Contact section
        const baseColor = new THREE.Color(matColor);
        const contactColor = new THREE.Color('#3B82F6');
        mat.color.copy(baseColor).lerp(contactColor, contactMorphT);
      }
    }

    const positions = positionsRef.current;
    const qTargets = questionTargetsRef.current;
    const bTargets = butterflyTargetsRef.current;
    const currentTargets = currentTargetsRef.current;
    const edges = edgesRef.current;

    const currentScale = 0.30 * (1 - morphT) + 0.45 * morphT;
    const mouseLocalX = ((state.pointer.x * viewport.width) / 2 - meshRef.current.position.x) / currentScale;
    const mouseLocalY = ((state.pointer.y * viewport.height) / 2 - meshRef.current.position.y) / currentScale;
    // World-space mouse position (no scale division) — used for barrier particles in Contact
    const mouseWorldX = (state.pointer.x * viewport.width) / 2;
    const mouseWorldY = (state.pointer.y * viewport.height) / 2;

    const totalCount = positions.length / 3;
    const halfCount = Math.floor(totalCount / 2);

    let about3DX = 0;
    let about3DY = 0;
    let web3DX = 0;
    let web3DY = 0;
    let mobile3DX = 0;
    let mobile3DY = 0;
    let activeDomTextHeight3D = 0.45;

    if (typeof document !== 'undefined') {
      const iconAnchor = document.getElementById('cv-icon-anchor') || document.getElementById('cv-download-anchor');
      if (iconAnchor) {
        const rect = iconAnchor.getBoundingClientRect();
        const targetX = rect.right + (window.innerWidth > 768 ? 105 : 45);
        const targetY = rect.top + rect.height / 2 + (window.innerWidth > 768 ? 30 : 10);
        const ndcX = (targetX / window.innerWidth) * 2 - 1;
        const ndcY = -(targetY / window.innerHeight) * 2 + 1;
        about3DX = (ndcX * viewport.width) / 2;
        about3DY = (ndcY * viewport.height) / 2;
      }

      const webAnchor = document.getElementById('web-category-anchor');
      if (webAnchor) {
        const rect = webAnchor.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        const ndcX = (targetX / window.innerWidth) * 2 - 1;
        const ndcY = -(targetY / window.innerHeight) * 2 + 1;
        web3DX = (ndcX * viewport.width) / 2;
        web3DY = (ndcY * viewport.height) / 2;
      }

      const mobileAnchor = document.getElementById('mobile-category-anchor');
      if (mobileAnchor) {
        const rect = mobileAnchor.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        const ndcX = (targetX / window.innerWidth) * 2 - 1;
        const ndcY = -(targetY / window.innerHeight) * 2 + 1;
        mobile3DX = (ndcX * viewport.width) / 2;
        mobile3DY = (ndcY * viewport.height) / 2;
      }

      // Measure exact DOM h3 text height dynamically in 3D viewport units
      const activeAnchor = document.getElementById(activeCategoryRef.current === 0 ? 'web-category-anchor' : 'mobile-category-anchor');
      if (activeAnchor) {
        const h3 = activeAnchor.querySelector('h3');
        if (h3) {
          const rect = h3.getBoundingClientRect();
          activeDomTextHeight3D = (rect.height / window.innerHeight) * viewport.height;
        }
      }
    }

    const activeTargetX = activeCategoryRef.current === 0 ? web3DX : mobile3DX;
    const activeTargetY = activeCategoryRef.current === 0 ? web3DY : mobile3DY;

    const posLerp = morphT > 0.5 ? 1.0 : 0.08;
    currentCategoryPosRef.current.x += (activeTargetX - currentCategoryPosRef.current.x) * posLerp;
    currentCategoryPosRef.current.y += (activeTargetY - currentCategoryPosRef.current.y) * posLerp;

    const catCurrentPos = currentCategoryPosRef.current;

    for (let i = 0; i < positions.length; i += 3) {
      const baseSpeed = 0.05;
      const formationBoost = formationProgressRef.current * 0.05;
      const lerpSpeed = baseSpeed + formationBoost;

      const pIdx = i / 3;
      const isSecondHalf = pIdx >= halfCount;

      const isEdge = edges[pIdx] === 1;
      const livingScale = isEdge ? 1 : 0;

      const livingX = Math.sin(time * 1.5 + i * 0.1) * 0.4 * livingScale * (1 - morphT) * (1 - contactMorphT);
      const livingY = Math.cos(time * 1.3 + i * 0.08) * 0.4 * livingScale * (1 - morphT) * (1 - contactMorphT);
      const livingZ = Math.sin(time * 1.7 + i * 0.12) * 0.6 * livingScale * (1 - morphT) * (1 - contactMorphT);

      const arrowPulseZ = Math.sin(time * 3 + i * 0.04) * 0.15 * morphT * (1 - projectMorphT) * (1 - contactMorphT);

      const swarm1 = Math.sin(morphT * Math.PI) * 1.5 * (1 - projectMorphT);
      const swarm2 = Math.sin(projectMorphT * Math.PI) * 2.2 * morphT * (1 - contactMorphT);
      const swarm3 = Math.sin(contactMorphT * Math.PI) * 2.6 * projectMorphT;
      // Once fully in contact section, suppress ALL arc swarm so particles are perfectly still
      const totalSwarm = (swarm1 + swarm2 + swarm3) * (1 - contactMorphT);

      const arcX = Math.sin(time * 2.5 + i * 0.08) * totalSwarm;
      const arcY = Math.cos(time * 2.2 + i * 0.06) * totalSwarm;
      const arcZ = Math.sin(time * 2.8 + i * 0.11) * totalSwarm * 0.8;

      const arrowX = bTargets[i] ?? 0;
      const arrowY = bTargets[i + 1] ?? 0;
      const arrowZ = bTargets[i + 2] ?? 0;

      let catX = arrowX;
      let catY = arrowY;
      let catZ = arrowZ;

      const catPts = catTargetsRef.current;
      if (isSecondHalf && catPts) {
        const cIdx = (pIdx - halfCount) * 3;
        if (cIdx + 2 < catPts.length) {
          const deltaX = (catCurrentPos.x - about3DX) / (currentScale || 1);
          const deltaY = (catCurrentPos.y - about3DY) / (currentScale || 1);
          const arrowFloatOffset = (floatY * morphT * (1 - projectMorphT)) / (currentScale || 1);

          const wordScale = (activeDomTextHeight3D * 0.7) / (currentScale || 1);

          const baseX = (catPts[cIdx] * wordScale) + deltaX;
          const baseY = (catPts[cIdx + 1] * wordScale) + deltaY - arrowFloatOffset;
          const baseZ = catPts[cIdx + 2];

          // Scatter during 0→0.5, reform during 0.5→1
          const seeds = catScatterSeedsRef.current;
          const sIdx = (pIdx - halfCount) * 3;
          if (catT > 0 && catT < 1 && seeds && sIdx + 2 < seeds.length) {
            // scatterBurst peaks at catT=0.5 then falls back to 0
            const burst = Math.sin(catT * Math.PI);
            catX = baseX + seeds[sIdx]     * burst;
            catY = baseY + seeds[sIdx + 1] * burst;
            catZ = baseZ + seeds[sIdx + 2] * burst;
          } else {
            catX = baseX;
            catY = baseY;
            catZ = baseZ;
          }
        }
      }

      const aboutTargetX = isSecondHalf ? catX : arrowX;
      const aboutTargetY = isSecondHalf ? catY : arrowY;
      const aboutTargetZ = isSecondHalf ? catZ : arrowZ + arrowPulseZ;

      const numX = currentTargets && currentTargets.length === positions.length ? currentTargets[i] : arrowX;
      const numY = currentTargets && currentTargets.length === positions.length ? currentTargets[i + 1] : arrowY;
      const numZ = currentTargets && currentTargets.length === positions.length ? currentTargets[i + 2] : arrowZ;

      const planePts = contactTargetsRef.current;
      const planeX = planePts && planePts.length === positions.length ? planePts[i] : arrowX;
      const planeY = planePts && planePts.length === positions.length ? planePts[i + 1] : arrowY;
      const planeZ = planePts && planePts.length === positions.length ? planePts[i + 2] : arrowZ;

      // Barrier particles are fully static — no movement whatsoever
      const projectTargetX = numX * (1 - contactMorphT) + planeX * contactMorphT;
      const projectTargetY = numY * (1 - contactMorphT) + planeY * contactMorphT;
      const projectTargetZ = numZ * (1 - contactMorphT) + planeZ * contactMorphT;

      const particleArcX = arcX;
      const particleArcY = arcY;
      const particleArcZ = arcZ;

      let shapeX = qTargets[i] * (1 - morphT) + aboutTargetX * (1 - projectMorphT) * morphT + projectTargetX * projectMorphT * morphT + livingX + particleArcX;
      let shapeY = qTargets[i + 1] * (1 - morphT) + aboutTargetY * (1 - projectMorphT) * morphT + projectTargetY * projectMorphT * morphT + livingY + particleArcY;
      let shapeZ = qTargets[i + 2] * (1 - morphT) + aboutTargetZ * (1 - projectMorphT) * morphT + projectTargetZ * projectMorphT * morphT + livingZ + particleArcZ;

      // Lock title once settled in About section (morphT > 0.85 & projectMorphT < 0.15)
      if (isSecondHalf && morphT > 0.85 && projectMorphT < 0.15) {
        shapeX = catX;
        shapeY = catY;
        shapeZ = catZ;
      }

      let tx = shapeX;
      let ty = shapeY;
      let tz = shapeZ;

      // Hero-section: mouse repulsion for question mark
      if (scatterEased < 0.4 && !isSecondHalf) {
        const dx = tx - mouseLocalX;
        const dy = ty - mouseLocalY;
        const dist = Math.hypot(dx, dy) || 0.1;
        const effectRadius = 3;

        if (dist < effectRadius && (state.pointer.x !== 0 || state.pointer.y !== 0)) {
          const pushFactor = (effectRadius - dist) / dist;
          tx += dx * pushFactor * 0.4;
          ty += dy * pushFactor * 0.4;
          tz += pushFactor * 1.5;
        }
      }

      // Contact-section: strong scatter repulsion from mouse cursor on the barrier
      // Barrier particles use world-space coordinates (not local-scaled), so compare against mouseWorldX/Y
      if (contactMorphT > 0.6 && (state.pointer.x !== 0 || state.pointer.y !== 0)) {
        const scatterRadius = 4.5;
        // tx/ty are world-space targets for barrier particles
        const dx = tx - mouseWorldX;
        const dy = ty - mouseWorldY;
        const dist = Math.hypot(dx, dy) || 0.1;

        if (dist < scatterRadius) {
          const strength = Math.pow((scatterRadius - dist) / scatterRadius, 1.6);
          const pushFactor = strength * 4.5 * contactMorphT;
          tx += (dx / dist) * pushFactor;
          ty += (dy / dist) * pushFactor;
          tz += strength * 2.5 * contactMorphT;
        }
      }

      const pLerpSpeed = morphT < 0.1
        ? 0.08
        : contactMorphT > 0.6
          ? 0.12  // slower recovery so pushed barrier particles spring back gently
          : (isSecondHalf && projectMorphT < 0.15 ? 0.35 : (projectMorphT < 0.9 ? 0.30 : lerpSpeed));

      positions[i] += (tx - positions[i]) * pLerpSpeed;
      positions[i + 1] += (ty - positions[i + 1]) * pLerpSpeed;
      positions[i + 2] += (tz - positions[i + 2]) * pLerpSpeed;
    }

    const geometry = meshRef.current.geometry as THREE.BufferGeometry;
    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.04}
        color={matColor}
        sizeAttenuation={true}
        transparent
        opacity={0.9}
        map={circleTexture || undefined}
        alphaTest={0.001}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleQuestionMark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 w-screen h-screen">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 65 }}
        style={{ pointerEvents: 'none' }}
        gl={{
          antialias: true,
          alpha: true,
          precision: 'highp',
          powerPreference: 'high-performance',
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <ParticleQuestion />
      </Canvas>
    </div>
  );
}
