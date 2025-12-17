# Phase 5: Analysis Workflow

## Overview

Manual analysis workflow using Claude Code to score messages and update rankings.

**Note:** This phase is intentionally deferred. The analysis will be run manually via Claude Code skill or Claude Code SDK.

## High-Level Flow

```
1. Fetch messages from Evolution API (last 7 days)
2. Process messages through Claude for scoring
3. Aggregate scores per member
4. Update ranking_members table
5. Create ranking_snapshots entry
6. Trigger WhatsApp announcement
```

## AI Analysis Prompt (Draft)

```
Analyze this WhatsApp message from a startup founders community.

Message: "{message_content}"
Context: Previous 3 messages in thread (if any)

Score 0-100 on:
1. **Helpfulness** - Does it answer a question or provide value?
2. **Quality** - Is it substantive or just "👍" / "kkk"?
3. **Engagement** - Does it invite further discussion?

Return JSON:
{
  "helpfulness": 0-100,
  "quality": 0-100,
  "engagement": 0-100,
  "is_spam": true/false,
  "category": "question" | "answer" | "resource" | "chitchat" | "reaction"
}
```

## Scoring Formula (Draft)

```
Raw Points = (messages × 1)
           + (replies × 2)
           + (threads_started × 5)
           + (links_shared × 3)
           + (ai_helpfulness × 0.5)

Activity Multiplier = streak_days > 7 ? 1.2 : 1.0

Weekly Score = Raw Points × Activity Multiplier
```

## Spam Filter

Messages scoring <10 on quality don't count toward rankings.

Filters out:
- Single emoji reactions
- "kkk", "haha", etc.
- Single word acknowledgments

## Implementation Options

### Option A: Claude Code Skill

Create `.claude/skills/ranking-analysis/` with:
- Prompt templates
- Data extraction helpers
- Supabase update functions

### Option B: Claude Code SDK

Build standalone script that:
- Uses Claude Code SDK for analysis
- Runs as cron job or manual trigger
- Updates database directly

## Data Points to Extract Per Member Per Week

```typescript
interface MemberWeeklyStats {
  memberId: string;
  messagesSent: number;
  repliesGiven: number;
  threadsStarted: number;
  linksShared: number;
  avgHelpfulness: number;
  avgQuality: number;
  avgEngagement: number;
  daysActive: number;
}
```

## Tier Calculation

After updating points, recalculate tiers:

```typescript
function calculateTiers(members: Member[]): void {
  const sorted = members.sort((a, b) => b.total_points - a.total_points);
  const total = sorted.length;

  sorted.forEach((member, index) => {
    const position = index + 1;
    const percentile = position / total;

    if (position <= 3) {
      member.current_tier = 'Board Member';
    } else if (percentile <= 0.10) {
      member.current_tier = 'CEO';
    } else if (percentile <= 0.25) {
      member.current_tier = 'Co-Founder';
    } else if (percentile <= 0.50) {
      member.current_tier = 'Builder';
    } else {
      member.current_tier = 'Estagiario';
    }

    member.rank_position = position;
  });
}
```

## Acceptance Criteria

- [ ] Analysis prompt finalized
- [ ] Scoring weights balanced
- [ ] Can process batch of messages
- [ ] Updates member scores correctly
- [ ] Creates weekly snapshot
- [ ] Tier calculation working
- [ ] Position changes tracked

## Status

🔴 **NOT STARTED** - To be implemented later via Claude Code skill or SDK
