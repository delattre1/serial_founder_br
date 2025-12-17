# Phase 1: Database Setup

## Overview

Create Supabase tables to store ranking members and weekly snapshots.

## Tables

### ranking_members

Stores each member's current ranking state.

```sql
CREATE TABLE ranking_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_id TEXT UNIQUE NOT NULL,
  phone TEXT,
  display_name TEXT NOT NULL,           -- "Daniel D."
  full_name TEXT,                        -- Original WA name
  joined_group_at TIMESTAMPTZ,

  -- Current scores
  total_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'Estagiario',
  rank_position INTEGER,

  -- Streaks
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for leaderboard queries
CREATE INDEX idx_ranking_members_points ON ranking_members(total_points DESC);
CREATE INDEX idx_ranking_members_position ON ranking_members(rank_position);
```

### ranking_snapshots

Weekly history for tracking progress over time.

```sql
CREATE TABLE ranking_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES ranking_members(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,

  -- Weekly metrics
  messages_sent INTEGER DEFAULT 0,
  replies_given INTEGER DEFAULT 0,
  threads_started INTEGER DEFAULT 0,
  links_shared INTEGER DEFAULT 0,
  ai_score INTEGER DEFAULT 0,           -- 0-100

  -- Position that week
  points_earned INTEGER DEFAULT 0,
  rank_position INTEGER,
  tier TEXT,
  position_change INTEGER,              -- +3, -1, etc

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(member_id, week_start)
);

-- Index for weekly queries
CREATE INDEX idx_snapshots_week ON ranking_snapshots(week_start DESC);
CREATE INDEX idx_snapshots_member ON ranking_snapshots(member_id);
```

## RLS Policies

```sql
-- Public read access for leaderboard
ALTER TABLE ranking_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON ranking_members
  FOR SELECT USING (true);

-- Only service role can insert/update
CREATE POLICY "Service role write access" ON ranking_members
  FOR ALL USING (auth.role() = 'service_role');

-- Same for snapshots
ALTER TABLE ranking_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON ranking_snapshots
  FOR SELECT USING (true);

CREATE POLICY "Service role write access" ON ranking_snapshots
  FOR ALL USING (auth.role() = 'service_role');
```

## Acceptance Criteria

- [ ] Tables created in Supabase
- [ ] Indexes added for performance
- [ ] RLS policies configured
- [ ] Can insert test member data
- [ ] Can query leaderboard sorted by points
