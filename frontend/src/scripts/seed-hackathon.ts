/**
 * Seed script for hackathon sample projects
 * Run this in browser console or create a temporary page to execute
 */

import { supabase } from '../lib/supabase';

const SAMPLE_PROJECTS = [
  {
    name: 'TaskFlow AI',
    slug: 'taskflow-ai-demo',
    short_description: 'Gerenciador de tarefas com IA que prioriza automaticamente seu backlog baseado em urgência e importância.',
    full_description: `## O que é o TaskFlow AI?

TaskFlow AI é um gerenciador de tarefas inteligente que usa IA para:

- **Priorizar automaticamente** suas tarefas baseado em urgência e importância
- **Sugerir deadlines** realistas baseado na sua velocidade de trabalho
- **Identificar blockers** e dependências entre tarefas
- **Gerar relatórios** de produtividade semanais

### Como funciona?

1. Você adiciona suas tarefas normalmente
2. A IA analisa o contexto e prioriza
3. Você foca no que importa

Simples assim.`,
    how_it_was_built: `### Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Supabase (Auth + DB + Storage)
- **IA**: Claude API para análise e priorização
- **Deploy**: Vercel

### Processo

Comecei definindo o problema: muita gente perde tempo decidindo O QUE fazer ao invés de FAZER.

Usei o Claude Code pra gerar a estrutura inicial do projeto em 30 minutos. Depois foi iterando: adicionar feature, testar, ajustar.`,
    project_url: 'https://taskflow-demo.vercel.app',
    github_url: 'https://github.com/demo/taskflow',
    is_solo: true,
    team_members: [],
    is_submitted: true,
  },
  {
    name: 'PixTracker',
    slug: 'pixtracker-demo',
    short_description: 'Dashboard para acompanhar todas suas transações PIX em tempo real com alertas e categorização automática.',
    full_description: `## PixTracker

Dashboard completo para gerenciar suas transações PIX.

### Funcionalidades

- **Dashboard em tempo real** com todas as transações
- **Categorização automática** usando IA
- **Alertas personalizados** para valores específicos
- **Relatórios mensais** exportáveis

### Por que criar isso?

Bancos mostram PIX de forma confusa. Criei algo simples e direto.`,
    how_it_was_built: `### Stack

- **Frontend**: React + Vite + Tailwind
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **IA**: OpenAI para categorização

### Processo

MVP em 24h. Foquei primeiro no dashboard básico, depois fui adicionando features.`,
    project_url: 'https://pixtracker-demo.vercel.app',
    github_url: 'https://github.com/demo/pixtracker',
    is_solo: false,
    team_members: ['Maria', 'Pedro'],
    is_submitted: true,
  },
  {
    name: 'CodeReview Bot',
    slug: 'codereview-bot-demo',
    short_description: 'Bot que faz code review automático usando Claude e comenta diretamente no seu PR do GitHub.',
    full_description: `## CodeReview Bot

Automatize seus code reviews com IA.

### Como funciona?

1. Instala o bot no seu repo
2. Abre um PR
3. Bot analisa e comenta sugestões

### Benefícios

- **Feedback instantâneo** sem esperar revisores
- **Padrões consistentes** em todo o código
- **Aprenda enquanto codifica** com explicações detalhadas`,
    how_it_was_built: `### Stack

- **Bot**: GitHub App + Probot
- **IA**: Claude API
- **Deploy**: Railway

### Processo

Comecei pelo webhook do GitHub, depois integrei o Claude para análise. O mais difícil foi formatar os comentários inline.`,
    project_url: 'https://codereview-bot.dev',
    github_url: 'https://github.com/demo/codereview-bot',
    is_solo: true,
    team_members: [],
    is_submitted: true,
  },
];

export async function seedHackathonProjects(userId: string) {
  console.log('Seeding hackathon projects...');

  for (const project of SAMPLE_PROJECTS) {
    const { data, error } = await supabase
      .from('hackathon_projects')
      .insert({
        ...project,
        user_id: userId,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ${project.name}:`, error);
    } else {
      console.log(`✓ Inserted: ${data.name}`);
    }
  }

  console.log('Done seeding!');
}

// To use: import this and call seedHackathonProjects(user.id) from browser console
// Or add a temporary button that calls it
