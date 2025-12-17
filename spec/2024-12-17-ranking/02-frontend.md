# Phase 2: Frontend - Ranking Page

## Overview

Create `/ranking` page following Serial Founders brutalist design system.

## Files to Create

```
src/pages/Ranking/index.tsx       -- Main leaderboard page
src/components/ranking/
  LeaderboardCard.tsx             -- Individual member row
  TierBadge.tsx                   -- Tier emoji + label
  PositionChange.tsx              -- Arrow + change indicator
  StatsBreakdown.tsx              -- Member detail modal/section
```

## Design Specifications

### Brand Guidelines (Brutalist)

- **Background**: Black (`bg-black`)
- **Text**: White primary, neutral-400 secondary
- **Accent**: Lime-400 (`text-lime-400`, `bg-lime-400`)
- **Fonts**: Anton (display), Space Mono (body)
- **Borders**: 3px solid white, 6px lime offset shadow
- **Effects**: Scanline animation, noise overlay, grid background

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Marquee bar - lime bg]                                        │
│  SERIAL_FOUNDERS // RANKING // SEMANA_51 // 2025               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  QUEM SHIP, APARECE.                                           │
│  QUEM NAO SHIP, SOME.                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ #01  DANIEL D.     🏛️ BOARD_MEMBER    1,847 pts  ↑2    │   │
│  │      [progress bar]                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ #02  MARIA S.      🏛️ BOARD_MEMBER    1,654 pts  ↑5    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ...                                                            │
│                                                                 │
│  // TIER: 🎯 CEO ──────────────────────────────────────────    │
│  #04  Ana L.         🎯 CEO              1,201 pts  ↑12        │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Component: LeaderboardCard

```tsx
interface LeaderboardCardProps {
  position: number;
  displayName: string;
  tier: string;
  totalPoints: number;
  positionChange: number;
  isTopThree?: boolean;
}
```

Visual states:
- Top 3: Full brutal-border card with progress bar
- Others: Simpler row with less emphasis
- Hover: `hover-shift` effect (translate + larger shadow)

### Component: TierBadge

```tsx
const TIERS = {
  'Board Member': { emoji: '🏛️', color: 'text-lime-400' },
  'CEO': { emoji: '🎯', color: 'text-white' },
  'Co-Founder': { emoji: '💼', color: 'text-white' },
  'Builder': { emoji: '🛠️', color: 'text-neutral-400' },
  'Estagiario': { emoji: '📝', color: 'text-neutral-600' },
};
```

### Component: PositionChange

```tsx
// ↑3 = lime color, ↓2 = red color, NEW = lime badge
{positionChange > 0 && <span className="text-lime-400">↑{positionChange}</span>}
{positionChange < 0 && <span className="text-red-500">↓{Math.abs(positionChange)}</span>}
{positionChange === null && <span className="text-lime-400">NEW</span>}
```

## Data Fetching

```tsx
// src/pages/Ranking/index.tsx
const { data: members } = await supabase
  .from('ranking_members')
  .select('*')
  .order('rank_position', { ascending: true });
```

## Acceptance Criteria

- [ ] `/ranking` route added to React Router
- [ ] Page loads and displays leaderboard
- [ ] Top 3 have emphasized card styling
- [ ] Tier sections visually separated
- [ ] Position changes shown with arrows
- [ ] Brutalist design matches brand guidelines
- [ ] Scanline + noise overlays present
- [ ] Mobile responsive
