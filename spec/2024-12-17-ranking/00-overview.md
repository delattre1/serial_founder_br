# Serial Founders Ranking - Overview

## Product Summary

Community gamification system for Serial Founders Brasil WhatsApp group. Track member contributions, calculate scores, display rankings, and reward top contributors.

## Core Flow

```
Evolution API          Manual Analysis         Supabase           Frontend
(fetch messages)  -->  (Claude Code)     -->  (store scores) --> /ranking page
                                                    |
                                              Evolution API
                                          (weekly announcement)
```

## Key Decisions

| Aspect | Decision |
|--------|----------|
| **Purpose** | Track contributions, gamify community, reward top members |
| **Scoring** | Volume + Quality + Engagement + AI score + Streaks |
| **Starting points** | Everyone starts at 0 |
| **Tiers** | Board Member > CEO > Co-Founder > Builder > Estagiario |
| **Display names** | First name + last initial (Daniel D.) |
| **Update frequency** | Weekly (manual trigger) |
| **Announcements** | WhatsApp bot posts weekly rankings |

## Tier System

| Tier | Requirement | Emoji |
|------|-------------|-------|
| Board Member | Top 3 members | 🏛️ |
| CEO | Top 10% | 🎯 |
| Co-Founder | Top 25% | 💼 |
| Builder | Top 50% | 🛠️ |
| Estagiario | Everyone else | 📝 |

## Scoring Metrics

1. **Volume** - Messages sent, replies, reactions
2. **Quality** - Links shared, resources, helpful answers
3. **Engagement** - Threads started, reply rate on posts
4. **AI Score** - Claude-judged helpfulness (0-100)
5. **Membership** - Join date, days active, streak count

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Database**: Supabase
- **WhatsApp**: Evolution API
- **Analysis**: Claude Code (skill/SDK - manual)

## Phases

1. [Database Setup](./01-database.md)
2. [Frontend - Ranking Page](./02-frontend.md)
3. [Evolution API Setup](./03-evolution-setup.md)
4. [WhatsApp Bot Announcements](./04-bot-announcements.md)
5. [Analysis Workflow](./05-analysis-workflow.md)
