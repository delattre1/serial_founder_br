import { Check, X, Share2, Trophy, Medal, Award } from 'lucide-react';
import { CURRENT } from '@/config/hackathon';

const PLACE_STYLE = {
  1: { icon: Trophy, text: 'text-yellow-400', hex: '#facc15', label: '1º LUGAR' },
  2: { icon: Medal, text: 'text-neutral-300', hex: '#d4d4d4', label: '2º LUGAR' },
  3: { icon: Award, text: 'text-orange-400', hex: '#fb923c', label: '3º LUGAR' },
} as const;

export function HackathonRules() {
  const { rules, entry, prizes, prizesNote } = CURRENT;
  const totalUsd = prizes.reduce((s, p) => s + p.usd, 0);
  const totalBrl = Math.round(prizes.reduce((s, p) => s + p.brl, 0) / 100) * 100;

  return (
    <section id="regras" className="py-16 px-4 border-t-2 border-neutral-800">
      <div className="max-w-5xl mx-auto">
        {/* Rules section */}
        <div className="mb-12">
          <h2 className="font-brutal-display text-4xl md:text-5xl text-white mb-8">REGRAS</h2>
          <div className="grid gap-3">
            {rules.summary.map((rule, index) => (
              <div
                key={index}
                className="flex items-center gap-3 font-brutal-mono text-neutral-400"
              >
                <span className="text-lime-400">├─</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          {rules.docPending && (
            <div className="mt-6 border-2 border-neutral-800 bg-black p-4">
              <div className="font-brutal-mono text-sm text-lime-400">
                // DOCUMENTACAO COMPLETA DAS REGRAS SEED EM BREVE
              </div>
              <p className="font-brutal-mono text-xs text-neutral-500 mt-1">
                O Daniel vai publicar e compartilhar a especificacao completa do desafio.
              </p>
              {rules.docUrl && (
                <a
                  href={rules.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-brutal-mono text-xs text-lime-400 hover:underline"
                >
                  [VER DOCUMENTACAO]
                </a>
              )}
            </div>
          )}
        </div>

        {/* What's allowed / not allowed */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Allowed */}
          <div className="brutal-border bg-black p-8">
            <h3 className="font-brutal-display text-2xl text-lime-400 mb-6">O QUE PODE?</h3>
            <div className="space-y-3">
              {rules.allowed.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 font-brutal-mono text-neutral-300"
                >
                  <Check className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Not allowed */}
          <div className="border-3 border-red-500 bg-black p-8" style={{ border: '3px solid #ef4444' }}>
            <h3 className="font-brutal-display text-2xl text-red-500 mb-6">O QUE NAO PODE?</h3>
            <div className="space-y-3">
              {rules.notAllowed.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 font-brutal-mono text-neutral-300"
                >
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Entry = share the video */}
        <div className="mt-12 bg-lime-400 text-black p-8" style={{ border: '3px solid black', boxShadow: '6px 6px 0 0 rgba(0, 0, 0, 1)' }}>
          <div className="flex items-start gap-4">
            <Share2 className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-brutal-display text-3xl mb-3">{entry.headline}</h3>
              <p className="font-brutal-mono text-sm text-black/80">{entry.description}</p>
            </div>
          </div>
        </div>

        {/* Prize info — podium bars */}
        <div className="mt-12">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <h3 className="font-brutal-display text-3xl md:text-4xl text-white">PREMIACAO</h3>
            <div className="text-right">
              <div className="font-brutal-mono text-xs text-neutral-500 tracking-widest">// POOL TOTAL</div>
              <div className="font-brutal-display text-3xl md:text-4xl text-lime-400">
                ${totalUsd} <span className="text-neutral-500 text-xl md:text-2xl">· ~R${totalBrl.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
          <p className="font-brutal-mono text-neutral-400 mb-8">{prizesNote}</p>

          <div className="space-y-5">
            {prizes.map((p) => {
              const cfg = PLACE_STYLE[p.place as 1 | 2 | 3];
              const Icon = cfg.icon;
              return (
                <div
                  key={p.place}
                  className="bg-black p-6 flex items-center justify-between gap-4"
                  style={{ border: `3px solid ${cfg.hex}`, boxShadow: `8px 8px 0 0 ${cfg.hex}` }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Icon className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 ${cfg.text}`} />
                    <div className={`font-brutal-display text-2xl md:text-3xl ${cfg.text}`}>{cfg.label}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-brutal-display text-4xl md:text-5xl text-white leading-none">${p.usd}</div>
                    <div className="font-brutal-mono text-sm text-neutral-500 mt-1">~R${p.brl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
