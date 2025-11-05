# Hero Component Usage Guide

## Overview

The Hero component is a full-screen animated shader background with customizable overlay content including trust badges, headlines, subtitles, and call-to-action buttons.

## 🇧🇷 Current Portuguese Version

**Headline:**
- Line 1: "Pare de Planejar."
- Line 2: "Comece a Construir."

**Subtitle:**
"Tire seu produto do papel e coloque no ar — mesmo trabalhando 8h no CLT. Serial Founders Brasil é a comunidade que transforma devs em founders. Do zero ao lançamento em 30 dias."

**Trust Badge:**
"Mais de 1 dev brasileiro já lançou seu produto" 🚀

**CTA Buttons:**
- Primary: "Entrar na Comunidade (Grátis)"
- Secondary: "Ver Como Funciona"

## Basic Usage

```tsx
import Hero from "@/components/ui/animated-shader-hero";

function MyApp() {
  return (
    <Hero
      trustBadge={{
        text: "Your trust badge text",
        icons: ["🚀", "⭐", "✨"] // optional
      }}
      headline={{
        line1: "Your First Line",
        line2: "Your Second Line"
      }}
      subtitle="Your compelling subtitle text goes here..."
      buttons={{
        primary: {
          text: "Primary CTA",
          onClick: handlePrimaryClick
        },
        secondary: {
          text: "Secondary CTA",
          onClick: handleSecondaryClick
        }
      }}
      className="custom-classes" // optional
    />
  );
}
```

## Props

### `trustBadge` (optional)
- **Type:** `{ text: string; icons?: string[] }`
- **Description:** Display a trust badge at the top of the hero section
- **Example:**
  ```tsx
  trustBadge={{
    text: "Trusted by forward-thinking teams.",
    icons: ["✨"]
  }}
  ```

### `headline` (required)
- **Type:** `{ line1: string; line2: string }`
- **Description:** Two-line headline with gradient animations
- **Example:**
  ```tsx
  headline={{
    line1: "Launch Your",
    line2: "Workflow Into Orbit"
  }}
  ```

### `subtitle` (required)
- **Type:** `string`
- **Description:** Supporting text below the headline
- **Example:**
  ```tsx
  subtitle="Supercharge productivity with AI-powered automation..."
  ```

### `buttons` (optional)
- **Type:** `{ primary?: { text: string; onClick?: () => void }; secondary?: { text: string; onClick?: () => void } }`
- **Description:** Call-to-action buttons with click handlers
- **Example:**
  ```tsx
  buttons={{
    primary: {
      text: "Get Started for Free",
      onClick: () => console.log('Primary clicked')
    },
    secondary: {
      text: "Explore Features",
      onClick: () => console.log('Secondary clicked')
    }
  }}
  ```

### `className` (optional)
- **Type:** `string`
- **Description:** Additional CSS classes for the root container
- **Default:** `""`

## Features

- **Interactive WebGL Shader Background:** Responds to mouse/touch interactions
- **Smooth Animations:** Fade-in effects for all content elements
- **Responsive Design:** Adapts to different screen sizes
- **Gradient Text Effects:** Eye-catching headline animations
- **Customizable CTAs:** Primary and secondary button options
- **Performance Optimized:** Uses WebGL2 for efficient rendering

## Example Implementation

See `frontend/src/App.tsx` for a complete working example.
