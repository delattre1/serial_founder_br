# Phase 4: WhatsApp Bot Announcements

## Overview

Send weekly ranking updates to the Serial Founders WhatsApp group.

## Message Format

```
🏆 SERIAL_FOUNDERS // RANKING SEMANAL

Semana {WEEK_NUMBER} • {DATE}

━━━━━━━━━━━━━━━━━━━━━━━

🥇 #1 {NAME} ({POINTS} pts) {CHANGE}
🥈 #2 {NAME} ({POINTS} pts) {CHANGE}
🥉 #3 {NAME} ({POINTS} pts) {CHANGE}

━━━━━━━━━━━━━━━━━━━━━━━

📈 MAIORES SUBIDAS:
   {NAME} ↑{N} posições
   {NAME} ↑{N} posições

🔥 STREAKS:
   {NAME} - {N} dias
   {NAME} - {N} dias

━━━━━━━━━━━━━━━━━━━━━━━

Ver ranking completo:
serialfounders.com.br/ranking

// QUEM SHIP, APARECE.
```

## Data Required

```typescript
interface WeeklyAnnouncementData {
  weekNumber: number;
  date: string;
  topThree: {
    position: number;
    name: string;
    points: number;
    change: string; // "↑2", "↓1", "NEW"
  }[];
  biggestMovers: {
    name: string;
    positionsGained: number;
  }[];
  topStreaks: {
    name: string;
    days: number;
  }[];
}
```

## Message Builder Function

```typescript
function buildWeeklyAnnouncement(data: WeeklyAnnouncementData): string {
  const medals = ['🥇', '🥈', '🥉'];

  const topThreeLines = data.topThree
    .map((m, i) => `${medals[i]} #${m.position} ${m.name} (${m.points} pts) ${m.change}`)
    .join('\n');

  const moversLines = data.biggestMovers
    .map(m => `   ${m.name} ↑${m.positionsGained} posições`)
    .join('\n');

  const streaksLines = data.topStreaks
    .map(s => `   ${s.name} - ${s.days} dias`)
    .join('\n');

  return `🏆 SERIAL_FOUNDERS // RANKING SEMANAL

Semana ${data.weekNumber} • ${data.date}

━━━━━━━━━━━━━━━━━━━━━━━

${topThreeLines}

━━━━━━━━━━━━━━━━━━━━━━━

📈 MAIORES SUBIDAS:
${moversLines}

🔥 STREAKS:
${streaksLines}

━━━━━━━━━━━━━━━━━━━━━━━

Ver ranking completo:
serialfounders.com.br/ranking

// QUEM SHIP, APARECE.`;
}
```

## Sending via Evolution API

```typescript
async function sendWeeklyAnnouncement(message: string) {
  const response = await fetch(
    `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: SERIAL_FOUNDERS_GROUP_JID,
        text: message,
      }),
    }
  );

  return response.json();
}
```

## Trigger Options

1. **Manual** - Admin runs script/function when ready
2. **Supabase Edge Function** - Called via HTTP endpoint
3. **Claude Code command** - `/send-ranking` slash command (later)

## Acceptance Criteria

- [ ] Message format finalized
- [ ] Builder function creates correct output
- [ ] Can send test announcement to group
- [ ] Top 3, movers, and streaks displayed correctly
- [ ] Link to website included
