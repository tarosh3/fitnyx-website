# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with the FitNyx React project.

## Project Overview

FitNyx is a premium fitness app landing page built with React, Vite, and Three.js for 3D graphics.

## Development

**Local dev:**
```bash
npm install
npm run dev
```

**Build:**
```bash
npm run build
```

**Lint:**
```bash
npm run lint
```

## Architecture

### Components
- `src/components/` — Reusable UI components.
- `src/sections/` — Main landing page sections (Hero, Features, PhoneScroll, etc.).

### Styling
- `src/styles/style.css` — Core design system and CSS variables.

### 3D Graphics
- `src/components/ThreeScene.jsx` — (Example) Three.js scenes using React Three Fiber or vanilla Three.js.
- `public/3d-models/` — GLB models (Dumbbell, iPhone 17 Pro).

### State Management
- React hooks for UI and scroll interactions.

### Key Pattern: Scroll-Driven 3D
Transitions and animations based on scroll position, often involving 3D model orientation or texture swapping.
