# Hackathon Feature Specification

## Overview

Build a hackathon management system for "1º Hackaton Relâmpago – Do Zero ao Deploy" that allows users to:
- View hackathon information (public)
- Register projects (authenticated)
- Browse all participating projects (public)
- Upvote projects (authenticated)
- Optionally pay R$20 for prize pool participation

---

## Event Details

```
Event: 1º Hackaton Relâmpago – Do Zero ao Deploy
Start: 12/12 às 22:30
End: 14/12 às 20:00
Presentations + Voting: 14/12 às 20h
Opening: 12/12 às 21h (YouTube + Instagram)
Discord: Open from 12h
```

### Rules Summary
- Project must be NEW (started from zero)
- Theme is FREE (no illegal content)
- Public deploy required by deadline
- Must have: Landing page + User registration + Usable product

### What's Allowed
- AI tools (Claude, Cursor, etc.)
- Existing infrastructure
- Templates, libraries, open source code
- Vibe coding or manual coding
- Solo or team
- Help from anyone (even grandma)

### What's NOT Allowed
- Own code from previous projects
- Products that existed before the hackathon

---

## Routes

| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/hackathon` | No | Main hackathon page (info + projects gallery) |
| `/hackathon/register` | Yes | Project registration form |
| `/hackathon/project/:id` | No | Individual project detail page |
| `/hackathon/my-project` | Yes | Edit user's own project |
| `/hackathon/vote` | Yes | Voting page (during voting period) |

---

## Database Schema

### Tables

#### `hackathon_projects`
```sql
CREATE TABLE hackathon_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Project Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,      -- max 160 chars
  full_description TEXT,                 -- markdown supported
  how_it_was_built TEXT,                 -- tech stack, process

  -- URLs & Media
  project_url TEXT NOT NULL,             -- deployed URL
  github_url TEXT,
  demo_video_url TEXT,
  screenshot_url TEXT,                   -- uploaded or auto-generated

  -- Team
  team_members TEXT,                     -- JSON array of names
  is_solo BOOLEAN DEFAULT true,

  -- Payment
  paid_entry BOOLEAN DEFAULT false,
  payment_id TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,                -- when finalized
  is_submitted BOOLEAN DEFAULT false,

  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `hackathon_votes`
```sql
CREATE TABLE hackathon_votes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, project_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES hackathon_projects(id)
);
```

#### `hackathon_registrations`
```sql
CREATE TABLE hackathon_registrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,

  -- Payment preference
  wants_to_pay BOOLEAN DEFAULT false,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, skipped
  payment_id TEXT,

  -- Registration info
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Page Specifications

### 1. `/hackathon` - Main Page

#### Public View (Not Logged In)
```
┌─────────────────────────────────────────────────────────────┐
│ [MARQUEE] /// HACKATON RELAMPAGO /// DO ZERO AO DEPLOY /// │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  // 1º HACKATON RELAMPAGO                                   │
│                                                             │
│  DO ZERO                                                    │
│  AO DEPLOY                                                  │
│                                                             │
│  12/12 22:30 → 14/12 20:00                                  │
│                                                             │
│  [PARTICIPAR COM GOOGLE]                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  REGRAS                                                     │
│  ├─ Projeto novo (do zero)                                  │
│  ├─ Tema livre                                              │
│  ├─ Deploy público obrigatório                              │
│  └─ Landing + Cadastro + Produto funcional                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  O QUE PODE?                      O QUE NAO PODE?           │
│  ✓ IA (Claude, Cursor)            ✗ Código próprio antigo   │
│  ✓ Templates, libs, OSS           ✗ Produto já existente    │
│  ✓ Infra existente                                          │
│  ✓ Solo ou equipe                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PROJETOS PARTICIPANTES                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Preview  │ │ Preview  │ │ Preview  │                     │
│  │ [hover]  │ │ [hover]  │ │ [hover]  │                     │
│  ├──────────┤ ├──────────┤ ├──────────┤                     │
│  │ Name     │ │ Name     │ │ Name     │                     │
│  │ Desc...  │ │ Desc...  │ │ Desc...  │                     │
│  │ ▲ 12     │ │ ▲ 8      │ │ ▲ 5      │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Logged In View
Same as above, but:
- "PARTICIPAR" button changes to "REGISTRAR PROJETO" if not registered
- Shows "MEU PROJETO" button if already registered
- Can upvote projects (during voting period)
- Shows user's vote count

---

### 2. `/hackathon/register` - Project Registration

**Auth Required:** Yes

#### Step 1: Payment Preference
```
┌─────────────────────────────────────────────────────────────┐
│  COMO VOCE QUER PARTICIPAR?                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [GRATIS]                                            │    │
│  │ Participa sem pagar nada.                           │    │
│  │ Sem premiação para os vencedores.                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [R$ 20 - COM PREMIACAO]                             │    │
│  │ Valor vai para premiar os Top 3 projetos.           │    │
│  │ Todos que pagarem concorrem aos prêmios.            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Project Details Form
```
┌─────────────────────────────────────────────────────────────┐
│  REGISTRAR PROJETO                                          │
│                                                             │
│  Nome do Projeto *                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ MeuSaaS                                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Descrição Curta * (max 160 caracteres)                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Um app que resolve X problema para Y pessoas        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  URL do Projeto * (deploy público)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ https://meusaas.com                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Como foi construído?                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Usei Next.js, Supabase, Claude Code...              │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  GitHub (opcional)                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ https://github.com/user/repo                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Equipe                                                     │
│  ○ Solo    ● Em equipe                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ João, Maria, Pedro                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Screenshot/Imagem do Projeto                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [UPLOAD IMAGEM] ou deixe vazio para auto-gerar      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [SALVAR RASCUNHO]        [SUBMETER PROJETO]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Project Card Component

```jsx
<ProjectCard>
  ┌────────────────────────────────┐
  │                                │  <- Preview area (16:9 ratio)
  │     [Screenshot/Preview]       │     On hover: show live iframe
  │                                │     or animated preview
  ├────────────────────────────────┤
  │ PROJECT_NAME                   │  <- Anton font, bold
  │ Short description here that   │  <- Space Mono, muted
  │ explains what it does...       │
  ├────────────────────────────────┤
  │ ▲ 12 votos    @username       │  <- Vote count + author
  └────────────────────────────────┘
</ProjectCard>
```

**Hover Behavior:**
- On desktop: Replace screenshot with live iframe of the project URL
- Iframe loads lazily on hover
- Show loading spinner while iframe loads
- Fallback to screenshot if iframe fails

---

### 4. `/hackathon/project/:id` - Project Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  [← VOLTAR]                                                 │
│                                                             │
│  PROJECT_NAME                                               │
│  por @username • Solo/Equipe: João, Maria                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │              [LIVE PREVIEW IFRAME]                  │    │
│  │                 or Screenshot                       │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [ACESSAR PROJETO]    [GITHUB]    [▲ VOTAR - 12]            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  SOBRE O PROJETO                                            │
│  Full description here with markdown support...             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  COMO FOI CONSTRUIDO                                        │
│  Tech stack, process description...                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Voting System

**Rules:**
- Each user gets 3 votes total
- Can vote for different projects (1 vote per project max)
- Voting opens at 14/12 às 20:00
- Voting closes at 14/12 às 23:59

**UI:**
- Vote button shows current count
- Disabled if user already voted for that project
- Shows "X/3 votos usados" in header during voting period
- Real-time vote count updates (optional: use Supabase realtime)

---

## Technical Implementation

### Frontend Components

```
frontend/src/
├── pages/
│   └── Hackathon/
│       ├── index.tsx           # Main /hackathon page
│       ├── Register.tsx        # Project registration form
│       ├── ProjectDetail.tsx   # Individual project page
│       └── MyProject.tsx       # Edit own project
├── components/
│   └── hackathon/
│       ├── HackathonHero.tsx       # Hero section with event info
│       ├── HackathonRules.tsx      # Rules display
│       ├── ProjectCard.tsx         # Project preview card
│       ├── ProjectGrid.tsx         # Grid of project cards
│       ├── ProjectPreview.tsx      # Hover preview component
│       ├── VoteButton.tsx          # Upvote button
│       ├── PaymentChoice.tsx       # R$20 or free choice
│       └── RegistrationForm.tsx    # Project details form
```

### Backend/API

For local development, use SQLite via a simple Express server or serverless functions.

For production, migrate to Supabase:
- Tables as defined above
- Row Level Security (RLS) policies
- Storage bucket for screenshots
- Realtime subscriptions for vote counts

### Screenshot Generation

Options for auto-generating screenshots:
1. **Puppeteer/Playwright** - Run on server, capture screenshot of URL
2. **External API** - Use service like screenshotapi.net or urlbox.io
3. **Manual upload only** - Simplest, user provides image

Recommended: Start with manual upload, add auto-generation later.

### Live Preview on Hover

```tsx
const ProjectCard = ({ project }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {showPreview ? (
        <iframe
          src={project.project_url}
          className="w-full aspect-video"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <img src={project.screenshot_url} />
      )}
    </div>
  );
};
```

**Security considerations for iframe:**
- Use `sandbox` attribute
- Consider using a proxy to prevent tracking
- Some sites block iframe embedding (X-Frame-Options)
- Fallback to screenshot if iframe fails to load

---

## Payment Integration

### Options
1. **Stripe** - Most robust, handles international payments
2. **Mercado Pago** - Popular in Brazil, PIX support
3. **Manual PIX** - User sends PIX, admin confirms manually

### Recommended: Mercado Pago or Manual PIX
For a hackathon with R$20 entry, manual PIX verification might be simplest:
1. Show PIX key on registration
2. User sends R$20
3. User enters PIX transaction ID
4. Admin verifies and marks as paid

---

## Timeline / Phases

### Phase 1: MVP (Before hackathon starts)
- [ ] `/hackathon` page with event info
- [ ] Google auth integration (existing)
- [ ] Basic registration form (name, description, URL)
- [ ] Project listing (simple grid)
- [ ] SQLite database setup

### Phase 2: During Hackathon
- [ ] Project editing (my-project page)
- [ ] Screenshot upload
- [ ] Project detail pages

### Phase 3: Voting Period
- [ ] Vote system (3 votes per user)
- [ ] Vote counts on cards
- [ ] Leaderboard/ranking

### Phase 4: Post-Hackathon
- [ ] Results page
- [ ] Winner announcements
- [ ] Migrate to Supabase for persistence

---

## API Endpoints

```
GET    /api/hackathon/projects          # List all submitted projects
GET    /api/hackathon/projects/:id      # Get single project
POST   /api/hackathon/projects          # Create project (auth required)
PUT    /api/hackathon/projects/:id      # Update project (owner only)
DELETE /api/hackathon/projects/:id      # Delete project (owner only)

POST   /api/hackathon/register          # Register for hackathon
GET    /api/hackathon/my-registration   # Get user's registration

POST   /api/hackathon/vote/:projectId   # Vote for project
DELETE /api/hackathon/vote/:projectId   # Remove vote
GET    /api/hackathon/my-votes          # Get user's votes
```

---

## Environment Variables

```env
# Database
DATABASE_URL=sqlite:./hackathon.db  # Local
# DATABASE_URL=postgres://...        # Production (Supabase)

# Screenshot service (optional)
SCREENSHOT_API_KEY=xxx

# Payment (if using Mercado Pago)
MERCADO_PAGO_ACCESS_TOKEN=xxx
MERCADO_PAGO_PUBLIC_KEY=xxx

# Or manual PIX
PIX_KEY=email@example.com
```

---

## Open Questions

1. **Voting mechanism** - Should it be:
   - 3 votes total spread across projects?
   - Unlimited votes, 1 per project max?
   - Ranked voting (1st, 2nd, 3rd choice)?

2. **Prize distribution** - How split among Top 3?
   - 50% / 30% / 20%?
   - Equal split?
   - Winner takes all?

3. **Project submission deadline** -
   - Can submit anytime during hackathon?
   - Final submission deadline before voting?

4. **Visibility** -
   - Show projects during hackathon (competition visibility)?
   - Hide until voting period (surprise reveal)?

---

## Design Notes

Follow brand guidelines:
- Brutalist aesthetic (Anton + Space Mono fonts)
- Black/White/Lime-400 color scheme
- Scanline, noise, glitch effects
- Brutal borders with offset shadows
- No rounded corners
- Aggressive, direct copy
