import { Link } from 'react-router-dom';
import { ArrowLeft, FileCode, Check, X, AlertTriangle } from 'lucide-react';
import { CURRENT } from '@/config/hackathon';
import { DeadlineBanner } from '@/components/hackathon';

const JOURNEY = [
  'A pessoa se registra e entra no app',
  'Cria um projeto subindo uma página (mockup / HTML)',
  'Compartilha o link com um colega',
  'O colega abre o link e vê a mesma página',
  'O colega deixa um feedback ancorado num ponto da página (um pin)',
  'O autor vê o feedback no lugar certo e responde / resolve',
];

const REQUIRED = [
  ['ENTRAR (LOGIN COM GOOGLE)', 'A pessoa entra com login do Google e o app sabe quem é.'],
  ['SUBIR + RENDERIZAR', 'Dá pra criar um projeto e subir uma página (HTML); ela aparece igualzinha dentro do app.'],
  ['ACHAR DE NOVO', 'Seus projetos ficam numa lista pra você voltar neles.'],
  ['COMPARTILHAR', 'Tem um link que você manda; o colega abre e vê a mesma página.'],
  ['FEEDBACK ANCORADO', 'Clicar num ponto da página cria um pin de comentário ali, no ponto exato.'],
  ['PIN QUE FICA E TODO MUNDO VÊ', 'O pin persiste (recarregou, continua no mesmo lugar) e é compartilhado: quem abre vê os mesmos comentários. Tem uma lista deles também.'],
];

const OPTIONAL = [
  ['CONVERSA', 'Responder (thread), reagir com emoji, resolver / reabrir, editar e apagar o próprio comentário.'],
  ['PINS MELHORES', 'Arrastar o pin pra reposicionar, agrupar pins próximos, âncora que aguenta mudança de layout.'],
  ['VERSÕES', 'Projeto com várias opções de design e versões (iterações), com histórico pra comparar.'],
  ['AO VIVO', 'Ver quem está olhando a página agora + um feed de atividade do feedback recente.'],
  ['ORGANIZAÇÃO', 'Status do projeto (ativo / arquivado / publicado) e contadores no painel.'],
];

const NOT_GRADED = [
  ['Stack', 'Livre — MAS o entregável tem que deployar na Vercel + usar Supabase pro banco (é como testamos). Fora isso, escolha o que quiser.'],
  ['Pixel-perfect', 'Não é pra copiar o visual exato do Almanac. É pra entregar o comportamento.'],
];

const DELIVERABLES = [
  ['REPOSITÓRIO GIT COM A SUA SEED', 'Entregue o link de um repositório Git que a gente consegue acessar, contendo a sua SEED. Arquivo principal: SEED.md (pode ter outros .md de apoio). A SEED é o coração do entregável.'],
  ['DEPLOY FUNCIONANDO EM PRODUÇÃO', 'O projeto tem que estar rodando em produção (deploy na Vercel + banco no Supabase), num link que a gente CONSEGUE ACESSAR E USAR. Não é opcional.'],
  ['VÍDEO MOSTRANDO FUNCIONANDO', 'Um link público e acessível de um vídeo do produto rodando de verdade.'],
];

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Deadline banner */}
      <DeadlineBanner />

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/hackathon" className="flex items-center gap-2 font-brutal-mono text-sm text-neutral-400 hover:text-lime-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="font-brutal-display text-xl text-white">SERIAL_FOUNDERS</div>
          <Link to="/hackathon/register" className="border-2 border-lime-400 text-lime-400 px-4 py-2 text-sm hover:bg-lime-400 hover:text-black transition-colors">
            [PARTICIPAR]
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Hero */}
        <section>
          <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
            // O DESAFIO // SEED EDITION
          </div>
          <h1 className="font-brutal-display text-5xl md:text-7xl text-white leading-none mb-2">RECRIAR O</h1>
          <h1 className="font-brutal-display text-5xl md:text-7xl text-stroke-lime leading-none">ALMANAC</h1>
        </section>

        {/* Tutorial video — watch first */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-2">// TUTORIAL — O QUE ENTREGAR</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-6">Assista antes de começar.</p>
          <div className="brutal-border bg-black p-2">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/0Q1id0Eo6pw"
                title="Hackathon — O que você precisa entregar"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* 1. RECEITA, NÃO PRODUTO — top emphasis */}
        <section className="bg-lime-400 text-black p-8" style={{ border: '3px solid black', boxShadow: '8px 8px 0 0 rgba(0,0,0,1)' }}>
          <div className="flex items-start gap-3 mb-4">
            <FileCode className="w-8 h-8 flex-shrink-0" />
            <h2 className="font-brutal-display text-2xl md:text-3xl">A SEED É O CORAÇÃO DO ENTREGÁVEL</h2>
          </div>
          <ul className="space-y-3 font-brutal-mono text-sm md:text-base text-black">
            <li>► O que importa é a <strong>RECEITA</strong> (a SEED) que constrói o projeto — <strong>não</strong> um app feito à mão.</li>
            <li>► Hidratada (colada num agente de IA), a SEED <strong>constrói o projeto do zero</strong>.</li>
            <li>► Pra validar, exigimos <strong>3 entregáveis (abaixo)</strong>: o repositório Git com a SEED + um deploy acessível + um vídeo. Entregar um app feito à mão <strong>sem a seed que o constrói</strong> = <strong>DESQUALIFICADO</strong>.</li>
          </ul>
        </section>

        {/* 2. O DESAFIO */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-4">// O DESAFIO</h2>
          <p className="font-brutal-mono text-base text-neutral-300 leading-relaxed">
            O <strong className="text-lime-400">Almanac</strong> é tipo "comentários do Figma" pra qualquer página: você sobe um mockup,
            manda o link pra alguém, e a pessoa <strong className="text-white">deixa feedback ancorado num ponto exato da tela</strong> — um pin com
            comentário, em vez de mandar print no Slack.
          </p>
          <p className="font-brutal-mono text-base text-neutral-300 leading-relaxed mt-3">
            Sua missão: escrever uma <strong className="text-lime-400">SEED (.md)</strong> que, hidratada num agente, constrói um app com esse comportamento.
            A seed é a receita. O agente cozinha. No fim, o app tem que rodar.
          </p>
        </section>

        {/* ENTREGÁVEIS OBRIGATÓRIOS */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-2">// 3 ENTREGÁVEIS OBRIGATÓRIOS</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-6">Os três são obrigatórios. Faltou um, não passou.</p>
          <div className="grid gap-4">
            {DELIVERABLES.map(([title, desc], i) => (
              <div key={i} className="brutal-border-lime bg-black p-5 flex items-start gap-4">
                <span className="font-brutal-display text-3xl text-lime-400 leading-none flex-shrink-0">{String.fromCharCode(97 + i)})</span>
                <div>
                  <div className="font-brutal-display text-xl text-white">{title}</div>
                  <p className="font-brutal-mono text-sm text-neutral-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. JORNADA */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-2">// SUA SEED TEM QUE ENTREGAR ISSO</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-6">A jornada abaixo é o critério de aceitação. Se roda do começo ao fim, tá valendo.</p>
          <div className="brutal-border bg-black p-6 space-y-3">
            {JOURNEY.map((step, i) => (
              <div key={i} className="flex items-start gap-3 font-brutal-mono text-neutral-300">
                <span className="text-lime-400 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. REQUISITOS OBRIGATÓRIOS */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-2">// 6 REQUISITOS OBRIGATÓRIOS</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-6">Sem isso, não conta.</p>
          <div className="grid gap-4">
            {REQUIRED.map(([title, desc], i) => (
              <div key={i} className="brutal-border bg-black p-5 flex items-start gap-4">
                <Check className="w-6 h-6 text-lime-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-brutal-display text-xl text-white">{title}</div>
                  <p className="font-brutal-mono text-sm text-neutral-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH REQUIREMENTS — how it's tested */}
        <section className="brutal-border-lime bg-black p-8">
          <h2 className="font-brutal-display text-2xl md:text-3xl text-lime-400 mb-2">// REQUISITOS DE TECNOLOGIA</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-5">Como vamos testar o seu projeto:</p>
          <ul className="space-y-3 font-brutal-mono text-base text-neutral-200">
            <li>► Seu projeto vai ser testado com <strong className="text-white">deploy na Vercel</strong> + <strong className="text-white">banco no Supabase</strong>.</li>
            <li>► Se o deploy não funcionar na Vercel, ou o banco não rodar no Supabase, <strong className="text-lime-400">o projeto não passou</strong>.</li>
            <li>► Fora isso, a stack é livre — escolha o que quiser.</li>
          </ul>
        </section>

        {/* 5. DIFERENCIAIS */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-2">// DIFERENCIAIS (OPCIONAL)</h2>
          <p className="font-brutal-mono text-sm text-neutral-400 mb-6">Não é obrigatório, mas sobe a régua — e a régua decide quem ganha.</p>
          <div className="grid gap-3">
            {OPTIONAL.map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-3 font-brutal-mono text-neutral-300">
                <span className="text-lime-400">├─</span>
                <span><strong className="text-white">{title}:</strong> <span className="text-neutral-400">{desc}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. O QUE NÃO É AVALIADO */}
        <section>
          <h2 className="font-brutal-display text-3xl md:text-4xl text-white mb-6">// O QUE NÃO É AVALIADO</h2>
          <div className="grid gap-3">
            {NOT_GRADED.map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-3 font-brutal-mono text-neutral-300">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">{title}:</strong> <span className="text-neutral-400">{desc}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. REGRA DE OURO */}
        <section className="border-3 border-red-500 bg-black p-8" style={{ border: '3px solid #ef4444' }}>
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-7 h-7 text-red-500 flex-shrink-0" />
            <h2 className="font-brutal-display text-2xl md:text-3xl text-red-500">REGRA DE OURO</h2>
          </div>
          <p className="font-brutal-mono text-base text-white">
            Entregar algo que não seja uma SEED = <strong className="text-red-500">DESQUALIFICADO</strong>.
          </p>
          <p className="font-brutal-mono text-sm text-neutral-400 mt-2">
            O entregável é a receita (.md), não só o app pronto. Quem entrega um produto sem a seed que o constrói, tá fora.
          </p>
        </section>

        {/* 8. REFERÊNCIA */}
        <section>
          <h2 className="font-brutal-display text-2xl md:text-3xl text-white mb-2">// REFERÊNCIA</h2>
          <p className="font-brutal-mono text-sm text-neutral-400">
            O que é uma boa receita (spec-driven development): o{' '}
            <a href="https://github.com/openai/symphony" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">Symphony da OpenAI</a>{' '}
            é o exemplo — o{' '}
            <a href="https://github.com/openai/symphony/blob/main/SPEC.md" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">SPEC.md</a>{' '}
            deles define o projeto inteiro, e você entrega esse spec pro agente construir. É exatamente a ideia de uma SEED: a receita constrói o produto.
          </p>
          <p className="font-brutal-mono text-sm text-neutral-400 mt-2">
            Padrão útil:{' '}
            <a href="https://www.rfc-editor.org/rfc/rfc2119" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">RFC 2119</a>{' '}
            — como uma spec marca o que é obrigatório vs. opcional.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center pt-4">
          <Link to="/hackathon/register" className="inline-block bg-lime-400 text-black brutal-border-inverse px-10 py-5 font-brutal-display text-xl tracking-wider hover-shift-dark">
            PARTICIPAR · ENTREGA ATÉ {CURRENT.dates.endLabel}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6">
        <div className="max-w-5xl mx-auto text-center font-brutal-mono text-xs text-neutral-600">
          // SERIAL_FOUNDERS_BR © 2026
        </div>
      </footer>

      <div className="fixed bottom-0 right-0 text-neutral-900 text-[15rem] md:text-[20rem] font-brutal-display opacity-20 pointer-events-none select-none leading-none">
        SF
      </div>
    </div>
  );
}
