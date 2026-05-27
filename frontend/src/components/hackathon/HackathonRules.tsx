import { Check, X, Share2 } from 'lucide-react';
import { CURRENT } from '@/config/hackathon';

export function HackathonRules() {
  const { rules, entry, prizes, prizesNote } = CURRENT;

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

        {/* Prize info */}
        <div className="mt-12 brutal-border-lime p-8">
          <h3 className="font-brutal-display text-2xl text-white mb-4">PREMIACAO</h3>
          <p className="font-brutal-mono text-neutral-400 mb-6">{prizesNote}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {prizes.map((p) => (
              <div key={p.place}>
                <div
                  className={`font-brutal-display text-3xl ${
                    p.place === 1 ? 'text-lime-400' : p.place === 2 ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {p.place}º
                </div>
                <div className="font-brutal-mono text-lg text-white mt-1">${p.usd}</div>
                <div className="font-brutal-mono text-xs text-neutral-500">~R${p.brl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
