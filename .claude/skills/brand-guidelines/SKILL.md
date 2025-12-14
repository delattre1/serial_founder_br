---
name: brand-guidelines
description: Serial Founders Brasil brand design system and visual guidelines. Use this skill whenever creating or modifying any visual component, page, UI element, or frontend feature. Ensures consistent brutalist aesthetic across the entire application. MUST be used for all frontend design work including new pages, components, landing pages, dashboards, modals, buttons, and any user-facing interface.
---

# Serial Founders Brasil - Brand Guidelines

## Design Philosophy

**BRUTALIST.** Raw. Industrial. Aggressive. No soft curves. No gentle gradients. No AI slop.

This is a community for BUILDERS who ship. The design reflects that energy: unapologetic, bold, execution-focused.

## Core Aesthetic Principles

1. **Raw over polished** - Exposed structure, visible grid, harsh edges
2. **High contrast** - Black/white with single electric accent
3. **Industrial typography** - Heavy display + monospace body
4. **Motion with purpose** - Glitch effects, scanlines, not decorative fluff
5. **No rounded corners** - Sharp edges only, brutalist box-shadows

## Color Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Background** | `#000000` | `bg-black` | Primary background |
| **Text Primary** | `#FFFFFF` | `text-white` | Headlines, emphasis |
| **Text Secondary** | `#a3a3a3` | `text-neutral-400` | Body text |
| **Text Muted** | `#525252` | `text-neutral-600` | Labels, captions |
| **Accent** | `#a3e635` | `text-lime-400` / `bg-lime-400` | CTAs, highlights, borders |
| **Border** | `#262626` | `border-neutral-800` | Dividers, cards |

### Color Rules

- **NEVER** use gradients (except text-stroke effects)
- **NEVER** use soft pastels or muted tones
- **ALWAYS** use lime-400 as the single accent color
- Accent on black = lime text/border. Accent cards = lime bg with black text.

## Typography

### Font Stack

```css
/* Display - Headlines, big statements */
font-family: 'Anton', Impact, sans-serif;

/* Mono - Body text, labels, code-like elements */
font-family: 'Space Mono', 'Courier New', monospace;
```

### Font Import

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Anton&display=swap');
</style>
```

### Typography Scale

| Element | Font | Size | Weight | Class Example |
|---------|------|------|--------|---------------|
| Hero H1 | Anton | 6xl-9xl | normal | `font-brutal-display text-6xl md:text-9xl` |
| Section H2 | Anton | 4xl-5xl | normal | `font-brutal-display text-4xl md:text-5xl` |
| Body | Space Mono | lg-xl | normal | `font-brutal-mono text-lg` |
| Labels | Space Mono | xs-sm | normal | `text-xs tracking-widest` |
| Code/Status | Space Mono | sm | normal | `font-mono text-sm` |

### Text Effects

```css
/* Outlined text - for emphasis */
.text-stroke {
  -webkit-text-stroke: 2px white;
  color: transparent;
}
```

## Component Patterns

### Brutal Buttons

```jsx
{/* Primary - Dark with lime accent */}
<button className="brutal-border bg-black px-8 py-4 text-white hover-shift transition-all">
  LABEL
</button>

{/* Accent - Lime with dark text */}
<button className="bg-lime-400 text-black brutal-border-inverse px-8 py-4 hover-shift-dark">
  LABEL
</button>

{/* Ghost - Border only */}
<button className="border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
  [LABEL]
</button>
```

### Brutal Cards

```css
.brutal-border {
  border: 3px solid white;
  box-shadow: 6px 6px 0 0 rgba(163, 230, 53, 1);
}

.brutal-border-inverse {
  border: 3px solid black;
  box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 1);
}

.hover-shift:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 0 rgba(163, 230, 53, 1);
}
```

### Labels & Tags

```jsx
{/* Channel/category labels */}
<div className="text-lime-400 text-xs tracking-widest">CANAL_01</div>

{/* Status indicators */}
<div className="text-lime-400 text-sm tracking-widest">
  // STATUS: AUTHENTICATED
</div>
```

## Animation & Effects

### Required CSS Animations

```css
/* Glitch shake effect */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0); }
}

/* Scanline sweep */
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

/* Marquee scroll */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Cursor blink */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Scanline Overlay

```jsx
<div className="scanline" />

<style>{`
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to bottom, transparent, rgba(163, 230, 53, 0.15), transparent);
  animation: scanline 3s linear infinite;
  pointer-events: none;
  z-index: 100;
}
`}</style>
```

### Noise Texture Overlay

```jsx
<div className="noise-overlay" />

<style>{`
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
`}</style>
```

### Grid Background

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(163, 230, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(163, 230, 53, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

## Layout Principles

### Page Structure

```jsx
<div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
  {/* Overlays */}
  <div className="noise-overlay" />
  <div className="scanline" />

  {/* Optional: Marquee bar */}
  <div className="bg-lime-400 text-black py-2 marquee-container">...</div>

  {/* Header */}
  <header className="border-b-2 border-white p-4">...</header>

  {/* Main content */}
  <main className="container mx-auto px-4 py-12 md:py-20">...</main>

  {/* Footer */}
  <footer className="border-t-2 border-neutral-800 p-6">...</footer>

  {/* Large watermark decoration */}
  <div className="fixed bottom-0 right-0 text-neutral-900 text-[20rem] font-brutal-display opacity-30 pointer-events-none">
    SF
  </div>
</div>
```

### Spacing

- Use generous padding: `py-12 md:py-20` for main sections
- Card padding: `p-8`
- Button padding: `px-8 py-4` (large) or `px-4 py-2` (small)
- Gap between cards: `gap-8`

## Copy & Voice

### Tone

- **Aggressive** - No soft language
- **Direct** - Commands, not suggestions
- **Builder-focused** - Execution over ideas
- **Portuguese (BR)** - Primary language, English for impact words

### Example Phrases

```
// Good - Brutal, direct
"Sem desculpas. Sem mimimi. So EXECUCAO."
"Ideias sao lixo. Execucao e tudo."
"Lancou feio? Parabens, lancou."
"SHIP OR DIE"
"NO EXCUSES"

// Bad - Soft, corporate
"We believe in empowering founders..."
"Join our supportive community..."
"Take your time to perfect..."
```

### Label Formatting

- Use UPPERCASE for emphasis: `DISCORD`, `WHATSAPP`, `ENTRAR`
- Use underscores for technical feel: `SERIAL_FOUNDERS`, `CANAL_01`
- Use brackets for actions: `[SAIR]`, `[ENTRAR]`
- Use double slashes for status: `// STATUS: AUTHENTICATED`

## BANNED Elements

1. **Rounded corners** - Use sharp edges only
2. **Soft gradients** - No purple-to-pink, no gentle fades
3. **Pastel colors** - No soft pinks, blues, greens
4. **Generic fonts** - No Inter, Roboto, Arial, system fonts
5. **3D decorative elements** - No floating shapes, no Spline robots
6. **Soft shadows** - Use offset box-shadows only
7. **Emoji overuse** - Minimal or none
8. **Corporate speak** - No "empowering", "innovative", "synergy"

## Quick Reference

```
COLORS:     Black + White + Lime-400
FONTS:      Anton (display) + Space Mono (body)
BORDERS:    3px solid, 6px offset shadow
EFFECTS:    Scanline, noise, glitch, grid-bg
CORNERS:    Sharp only, no border-radius
TONE:       Brutal, direct, builder-focused
```
