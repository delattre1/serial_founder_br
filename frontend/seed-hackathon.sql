-- Seed script for hackathon sample projects
-- Run this in Supabase SQL Editor
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users

-- First, get your user ID by running:
-- SELECT id, email FROM auth.users LIMIT 5;

-- Then replace YOUR_USER_ID below and run:

INSERT INTO hackathon_projects (
  id, user_id, name, slug, short_description, full_description, how_it_was_built,
  project_url, github_url, is_solo, team_members, is_submitted, submitted_at, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'YOUR_USER_ID', -- Replace with your user ID
  'TaskFlow AI',
  'taskflow-ai-demo',
  'Gerenciador de tarefas com IA que prioriza automaticamente seu backlog baseado em urgência e importância.',
  '## O que é o TaskFlow AI?

TaskFlow AI é um gerenciador de tarefas inteligente que usa IA para:

- **Priorizar automaticamente** suas tarefas baseado em urgência e importância
- **Sugerir deadlines** realistas baseado na sua velocidade de trabalho
- **Identificar blockers** e dependências entre tarefas

### Como funciona?

1. Você adiciona suas tarefas normalmente
2. A IA analisa o contexto e prioriza
3. Você foca no que importa',
  '### Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Supabase
- **IA**: Claude API

### Processo

Usei o Claude Code pra gerar a estrutura inicial em 30 minutos.',
  'https://taskflow-demo.vercel.app',
  'https://github.com/demo/taskflow',
  true,
  '[]'::jsonb,
  true,
  NOW(),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'YOUR_USER_ID', -- Replace with your user ID
  'PixTracker',
  'pixtracker-demo',
  'Dashboard para acompanhar todas suas transações PIX em tempo real com alertas e categorização automática.',
  '## PixTracker

Dashboard completo para gerenciar suas transações PIX.

### Funcionalidades

- **Dashboard em tempo real** com todas as transações
- **Categorização automática** usando IA
- **Alertas personalizados** para valores específicos',
  '### Stack

- **Frontend**: React + Vite + Tailwind
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

MVP em 24h.',
  'https://pixtracker-demo.vercel.app',
  'https://github.com/demo/pixtracker',
  false,
  '["Maria", "Pedro"]'::jsonb,
  true,
  NOW(),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'YOUR_USER_ID', -- Replace with your user ID
  'CodeReview Bot',
  'codereview-bot-demo',
  'Bot que faz code review automático usando Claude e comenta diretamente no seu PR do GitHub.',
  '## CodeReview Bot

Automatize seus code reviews com IA.

### Como funciona?

1. Instala o bot no seu repo
2. Abre um PR
3. Bot analisa e comenta sugestões',
  '### Stack

- **Bot**: GitHub App + Probot
- **IA**: Claude API
- **Deploy**: Railway',
  'https://codereview-bot.dev',
  'https://github.com/demo/codereview-bot',
  true,
  '[]'::jsonb,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Verify insertion
SELECT id, name, slug, is_submitted FROM hackathon_projects;
