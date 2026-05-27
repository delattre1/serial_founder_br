// =============================================================================
// Hackathon round config — single source of truth for per-round copy & rules.
// To run a new edition: bump CURRENT_ROUND and add a ROUNDS[n] entry.
// Keep the DB `round` column in sync (see supabase/migrations).
// =============================================================================

export const CURRENT_ROUND = 2;

export interface PrizeTier {
  place: number;
  usd: number;
  brl: number; // approximate BRL conversion, display only (prizes paid in USD)
}

export interface RoundConfig {
  round: number;
  edition: string; // "2º"
  name: string; // "HACKATHON RELAMPAGO"
  theme: string; // "SEED"
  label: string; // small kicker above the hero headline
  tagline1: string; // hero headline line 1 (solid)
  tagline2: string; // hero headline line 2 (stroke)
  marquee: string; // one marquee segment (repeated by the component)
  status: 'open' | 'judging' | 'finished';
  dates: {
    startLabel: string;
    endLabel: string;
    subinfo: string[];
  };
  // Round 2 has no public voting — winners are picked by the host.
  voting: { enabled: boolean };
  entry: {
    headline: string;
    description: string;
    checkboxLabel: string;
    proofLabel: string;
    proofHint: string;
  };
  prizesNote: string;
  prizes: PrizeTier[];
  rules: {
    summary: string[];
    allowed: string[];
    notAllowed: string[];
    docPending: boolean; // true => show "rules doc coming soon" notice
    docUrl?: string;
  };
}

export const ROUNDS: Record<number, RoundConfig> = {
  2: {
    round: 2,
    edition: '2º',
    name: 'HACKATHON RELAMPAGO',
    theme: 'SEED',
    label: '// 2º HACKATHON RELAMPAGO // SEED EDITION',
    tagline1: 'DA SEED',
    tagline2: 'AO DEPLOY',
    marquee:
      '/// HACKATHON RELAMPAGO /// SEED EDITION /// 28-30 MAI /// SHIP OR DIE ///',
    status: 'open',
    dates: {
      startLabel: '28/05 15:30',
      endLabel: '30/05 23:59',
      subinfo: [
        '// INSCRICOES ATE: 28/05 23:30 BRT (quinta)',
        '// INICIO: 28/05 15:30 BRT (quinta)',
        '// SUBMISSAO ATE: 30/05 23:59 BRT (sabado)',
        '// VENCEDORES (live): 31/05 18:30 BRT (domingo) — Top 3 fazem pitch',
      ],
    },
    voting: { enabled: false },
    entry: {
      headline: 'INSCRICAO = COMPARTILHAR O VIDEO',
      description:
        'Sem taxa. Reposte o video de anuncio do hackathon no seu Instagram marcando @danedelattre. Esse repost e a sua inscricao.',
      checkboxLabel: 'Repostei o video de anuncio no Instagram e marquei @danedelattre',
      proofLabel: 'Print do seu repost (deve aparecer @danedelattre marcado) *',
      proofHint:
        'Envie o print do seu story/post mostrando a marcacao. O premio so e pago apos o Daniel confirmar o repost.',
    },
    prizesNote: 'Premiacao bancada pelo Daniel (paga em dolar). Top 3 levam:',
    prizes: [
      { place: 1, usd: 125, brl: 600 },
      { place: 2, usd: 50, brl: 250 },
      { place: 3, usd: 25, brl: 125 },
    ],
    rules: {
      summary: [
        'Projeto novo (do zero)',
        'Tema dentro do desafio SEED',
        'Deploy publico obrigatorio',
        'Produto funcional ate o prazo',
      ],
      allowed: [
        'IA (Claude, Cursor, etc.)',
        'Templates, libs, OSS',
        'Infra existente',
        'Participacao individual (solo)',
        'Ajuda de qualquer pessoa (ate a avo)',
      ],
      notAllowed: ['Codigo proprio antigo', 'Produto ja existente'],
      docPending: true, // CEO will publish the full SEED spec doc
      docUrl: undefined,
    },
  },
};

export const CURRENT: RoundConfig = ROUNDS[CURRENT_ROUND];
