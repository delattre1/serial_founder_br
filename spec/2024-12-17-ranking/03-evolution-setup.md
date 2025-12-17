# Phase 3: Evolution API Setup

## Overview

Connect Evolution API to fetch WhatsApp group messages and send announcements.

## Prerequisites

- Evolution API instance running (see `/home/ubuntu/n8n-evolution-template` on tpflow-hostinger)
- Admin WhatsApp connected to instance
- Serial Founders group accessible

## Environment Variables

```bash
# .env.local (frontend - for reference only, calls go through backend)
VITE_EVOLUTION_API_URL=http://your-evolution-instance:8080
VITE_EVOLUTION_INSTANCE_NAME=serial-founders
```

```bash
# Supabase Edge Function secrets
EVOLUTION_API_URL=http://your-evolution-instance:8080
EVOLUTION_API_KEY=your-api-key
EVOLUTION_INSTANCE_NAME=serial-founders
SERIAL_FOUNDERS_GROUP_JID=group-jid@g.us
```

## API Endpoints Used

### Fetch Group Messages

```bash
POST /chat/findMessages/{instance}
Content-Type: application/json
apikey: {EVOLUTION_API_KEY}

{
  "where": {
    "key": {
      "remoteJid": "{GROUP_JID}"
    },
    "timestamp": {
      "gte": "{7_DAYS_AGO_TIMESTAMP}"
    }
  }
}
```

Response contains:
- `key.participant` - sender's WhatsApp ID
- `pushName` - sender's display name
- `message.conversation` or `message.extendedTextMessage.text` - message content
- `messageTimestamp` - when sent

### Send Message to Group

```bash
POST /message/sendText/{instance}
Content-Type: application/json
apikey: {EVOLUTION_API_KEY}

{
  "number": "{GROUP_JID}",
  "text": "Message content here"
}
```

### Fetch Group Participants

```bash
GET /group/findParticipants/{instance}?groupJid={GROUP_JID}
apikey: {EVOLUTION_API_KEY}
```

Response contains member list with:
- `id` - WhatsApp ID
- `admin` - admin status

## One-Time Setup Steps

1. **Create Evolution instance** (if not exists):
```bash
curl -X POST http://evolution:8080/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "serial-founders", "qrcode": true}'
```

2. **Scan QR code** with admin WhatsApp

3. **Get group JID**:
```bash
curl -X GET "http://evolution:8080/group/fetchAllGroups/serial-founders" \
  -H "apikey: YOUR_API_KEY"
```

4. **Store group JID** in environment variables

## Message Data Structure

When fetching messages, extract:

```typescript
interface WhatsAppMessage {
  senderId: string;      // key.participant
  senderName: string;    // pushName
  content: string;       // message.conversation or extendedTextMessage.text
  timestamp: number;     // messageTimestamp
  isReply: boolean;      // message.extendedTextMessage?.contextInfo exists
  hasLink: boolean;      // content includes http:// or https://
}
```

## Acceptance Criteria

- [ ] Evolution instance created and connected
- [ ] Serial Founders group JID obtained
- [ ] Can fetch last 7 days of messages
- [ ] Can send test message to group
- [ ] Environment variables configured
