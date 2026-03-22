# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitNyx is a premium fitness app landing page — a static HTML/CSS/JavaScript website with Three.js 3D graphics. No framework, no build system, no package manager.

## Development

**Local dev:** Serve with any static HTTP server (e.g., `python3 -m http.server` or `npx serve`), then open `fitnyx.html`. There is no build step, bundler, test runner, or linter.

**Dependencies:** All external libraries (Three.js r128, GLTFLoader, DRACOLoader, Google Fonts) are loaded via CDN — no `package.json` or `node_modules`.

## Architecture

### HTML
- `fitnyx.html` — the single landing page containing all sections (hero, features, scrollytelling, pricing, FAQ, footer)
- Several empty placeholder HTML files exist for future SEO/landing pages

### CSS (`css/style.css`)
- Single stylesheet with CSS variables for theming:
  - `--g` (green #61c894), `--t` (teal #3DFFD4), `--o` (orange #FF6B35), `--bg` (dark #050508), `--su` (surface #0d0d15)
  - Font families: `--fh` (Syne), `--fd` (Bebas Neue), `--fb` (DM Sans)
- Reveal animation classes: `.rv`, `.rv-l`, `.rv-r` toggle to `.in` state via IntersectionObserver
- Responsive breakpoints at 1024px and 768px

### JavaScript (`js/`)
- **`ui.js`** — Custom cursor, nav scroll behavior, IntersectionObserver reveals, FAQ accordion
- **`hero-scene.js`** — Three.js scene rendering a floating dumbbell (`metal_dumbell.glb`) with mouse-follow camera
- **`scroll-scene.js`** — Three.js scroll-driven phone animation (`iPhone_17_Pro.glb`). Uses a 4-section state machine mapping scroll position to phone rotation/position and screen texture. Hidden on viewports <1024px.
- **`screens.js`** — Canvas 2D API drawing of app mockup screens (390×844px retina). Exports `SCREENS` array used by scroll-scene. Helper functions: `roundRect()`, `drawStatusBar()`, `drawLabel()`, `pill()`, `barChart()`
- **`three-utils.js`** — `applyScreenTexture()` utility handling NPOT texture mipmaps and planar UV projection for the phone display

### 3D Assets
- `metal_dumbell.glb` — hero section model
- `iPhone_17_Pro.glb` — scrollytelling phone model
- `assets/iphoneImage1.png` — splash screen image

### Key Pattern: Scroll-Driven 3D
The scrollytelling section (`#phone-scroll`) combines Three.js with Canvas 2D: `screens.js` draws app UI mockups onto canvas elements, `three-utils.js` applies them as textures to the phone model, and `scroll-scene.js` orchestrates transitions between 4 sections with physics-damped animation.
