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
  name: string; // "HACKATHON RELÂMPAGO"
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
    name: 'HACKATHON RELÂMPAGO',
    theme: 'SEED',
    label: '// 2º HACKATHON RELÂMPAGO // SEED EDITION',
    tagline1: 'DA SEED',
    tagline2: 'AO PRODUTO',
    marquee:
      '/// HACKATHON RELÂMPAGO /// SEED EDITION /// 28-30 MAI /// SHIP OR DIE ///',
    status: 'open',
    dates: {
      startLabel: '28/05 15:30',
      endLabel: '30/05 23:59',
      subinfo: [
        '// INSCRIÇÕES ATÉ: 28/05 23:30 BRT (quinta)',
        '// INÍCIO: 28/05 15:30 BRT (quinta)',
        '// SUBMISSÃO ATÉ: 30/05 23:59 BRT (sábado)',
        '// VENCEDORES (live): 31/05 18:30 BRT (domingo) — Top 3 fazem pitch',
      ],
    },
    voting: { enabled: false },
    entry: {
      headline: 'INSCRIÇÃO = COMPARTILHAR O VÍDEO',
      description:
        'Sem taxa. Reposte o vídeo de anúncio do hackathon no seu Instagram marcando @danedelattre. Esse repost é a sua inscrição.',
      checkboxLabel: 'Repostei o vídeo de anúncio no Instagram e marquei @danedelattre',
      proofLabel: 'Print do seu repost (deve aparecer @danedelattre marcado) *',
      proofHint:
        'Envie o print do seu story/post mostrando a marcação. O prêmio só é pago após o Daniel confirmar o repost.',
    },
    prizesNote: 'Premiação bancada pelo Daniel (paga em dólar). Top 3 levam:',
    prizes: [
      { place: 1, usd: 125, brl: 600 },
      { place: 2, usd: 50, brl: 250 },
      { place: 3, usd: 25, brl: 125 },
    ],
    rules: {
      summary: [
        'Desafio único já definido (recriar o Almanac — ver página do desafio)',
        'Produto funcional rodando (deploy público NÃO obrigatório)',
        'Vídeo do produto funcionando obrigatório na submissão',
        'Construído durante a janela do hackathon (qui→sáb)',
      ],
      allowed: [
        'IA (Claude, Cursor, etc.)',
        'Templates, libs, OSS',
        'Infra existente',
        'Participação individual (solo)',
        'Tudo construído durante a janela (qui→sáb)',
        'Ajuda de qualquer pessoa (até a avó)',
      ],
      notAllowed: ['Entregar algo que não seja uma seed'],
      docPending: true, // CEO will publish the full SEED spec doc
      docUrl: undefined,
    },
  },
};

export const CURRENT: RoundConfig = ROUNDS[CURRENT_ROUND];
