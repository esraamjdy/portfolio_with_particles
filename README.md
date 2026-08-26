# Esraa Magdy - Creative Developer Portfolio

A professional, interactive portfolio website built with Next.js, featuring sophisticated particle animations powered by React Three Fiber and Three.js.

## Features

### 🎨 Design System
- **Color Palette**: Sophisticated gradient colors (Coral #F8B2B2 → Mauve #AF719D → Purple #8B639B → Deep Blue #403D88)
- **Typography**: Space Grotesk (headings) + Crimson Text (serif accents)
- **Dark Theme**: Professional dark mode optimized for visual contrast and focus

### ✨ Interactive Elements

#### Particle System
- **Three.js + React Three Fiber**: 3D particle rendering with WebGL acceleration
- **Mouse Tracking**: Particles respond to cursor movement with physics-based interactions
- **Scroll-Triggered Animations**: Particles morph into different shapes as you scroll through sections:
  - **Hero**: Question mark formation (introducing Esraa's core value proposition)
  - **About**: Butterfly shape morphing
  - **Projects**: Circle formation
  - **Contact**: Question mark with color transition to deep blue
- **Shape Generation**: Procedural particle patterns for smooth, organic morphing

#### Smooth Animations
- Framer Motion for page transitions and component reveals
- Staggered animations for visual hierarchy
- Scroll-triggered reveals for About, Projects, and Contact sections
- Hover effects on interactive elements

### 📱 Sections

1. **Hero Section**
   - Bold introduction: "Hi, I'm Esraa Magdy"
   - Engaging tagline with interactive question mark
   - Call-to-action buttons (View Work / Get in Touch)
   - Animated scroll indicator

2. **About Section**
   - Professional bio highlighting expertise
   - Statistics cards (Projects, Years, Satisfaction, Awards)
   - Skills organized by category (Frontend, Design, Backend, Tools)
   - Glassmorphic card design with color-coded borders

3. **Projects Section**
   - 6 featured projects in a responsive grid
   - Project cards with gradient overlays
   - Technology tags for each project
   - GitHub and Live Demo links
   - Hover effects revealing additional information

4. **Contact Section**
   - Contact information and methods
   - Social media links (GitHub, LinkedIn, Twitter, Email)
   - Professional contact form
   - Footer with copyright

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + Custom CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Typography**: Google Fonts (Space Grotesk, Crimson Text)
- **Language**: TypeScript

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
pnpm build

# Run production build
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main portfolio page
│   └── globals.css         # Design tokens & base styles
├── components/
│   ├── Hero.tsx            # Hero section with intro
│   ├── About.tsx           # About section with skills
│   ├── Projects.tsx        # Projects showcase
│   ├── Contact.tsx         # Contact form & info
│   └── ParticleSystem.tsx  # 3D particle effects
└── public/                 # Static assets
```

## Customization

### Color Palette
Edit the color variables in `app/globals.css`:
```css
--palette-coral: #f8b2b2;
--palette-mauve: #af719d;
--palette-purple: #8b639b;
--palette-deep: #403d88;
```

### Typography
Modify fonts in `app/globals.css` and `app/layout.tsx`:
- Headings: Space Grotesk
- Body: Space Grotesk
- Accents: Crimson Text

### Particle Shapes
Customize particle formations in `components/ParticleSystem.tsx`:
- `generateQuestionMark()` - Question mark pattern
- `generateButterflyShape()` - Butterfly pattern
- `generateCircleShape()` - Circular pattern

### Content
- Update portfolio info in individual section components
- Modify projects data in `Projects.tsx`
- Update social links in `Contact.tsx`

## Performance Optimizations

- WebGL acceleration for particle rendering
- Lazy-loaded sections with scroll detection
- Optimized animations with GPU-accelerated transforms
- Responsive particle system that scales with viewport
- Code-split components with dynamic imports

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

Deploy to Vercel with one click:

```bash
# Vercel handles the build automatically
# Just push to GitHub and connect your repo
```

Or deploy manually:
```bash
pnpm build
# Deploy the `.next` folder to your hosting
```

## License

© 2024 Esraa Magdy. All rights reserved.
