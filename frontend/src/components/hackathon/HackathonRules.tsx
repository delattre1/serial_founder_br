import { Check, X } from 'lucide-react';

export function HackathonRules() {
  const rules = [
    'Projeto novo (do zero)',
    'Tema livre',
    'Deploy publico obrigatorio',
    'Landing + Cadastro + Produto funcional',
  ];

  const podePerguntas = [
    { pergunta: 'Pode pedir ajuda pra avo?', resposta: 'PODE!' },
    { pergunta: 'Pode pedir ajuda pro cachorro?', resposta: 'PODE!' },
    { pergunta: 'Pode usar IA?', resposta: 'PODE!' },
    { pergunta: 'Pode usar template pronto?', resposta: 'PODE!' },
    { pergunta: 'Pode escolher qualquer tema?', resposta: 'PODE!' },
    { pergunta: 'Pode fazer sozinho ou em equipe?', resposta: 'PODE!' },
  ];

  const allowed = [
    'IA (Claude, Cursor, etc.)',
    'Templates, libs, OSS',
    'Infra existente',
    'Solo ou equipe',
    'Ajuda de qualquer pessoa (ate a avo)',
  ];

  const notAllowed = [
    'Codigo proprio antigo',
    'Produto ja existente',
  ];

  return (
    <section id="regras" className="py-16 px-4 border-t-2 border-neutral-800">
      <div className="max-w-5xl mx-auto">
        {/* Rules section */}
        <div className="mb-12">
          <h2 className="font-brutal-display text-4xl md:text-5xl text-white mb-8">REGRAS</h2>
          <div className="grid gap-3">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center gap-3 font-brutal-mono text-neutral-400"
              >
                <span className="text-lime-400">├─</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's allowed / not allowed */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Allowed */}
          <div className="brutal-border bg-black p-8">
            <h3 className="font-brutal-display text-2xl text-lime-400 mb-6">O QUE PODE?</h3>
            <div className="space-y-3">
              {allowed.map((item, index) => (
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
              {notAllowed.map((item, index) => (
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

        {/* PODE? PODE! Section */}
        <div className="mt-12 bg-lime-400 text-black p-8" style={{ border: '3px solid black', boxShadow: '6px 6px 0 0 rgba(0, 0, 0, 1)' }}>
          <h3 className="font-brutal-display text-3xl mb-6">PODE? PODE!</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {podePerguntas.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-brutal-mono text-sm text-black/70">{item.pergunta}</span>
                <span className="font-brutal-display text-lg">{item.resposta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prize info */}
        <div className="mt-12 brutal-border-lime p-8">
          <h3 className="font-brutal-display text-2xl text-white mb-4">PREMIACAO</h3>
          <p className="font-brutal-mono text-neutral-400 mb-4">
            Participacao opcional de R$20 vai para o premio dos Top 3.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-brutal-display text-3xl text-lime-400">1º</div>
              <div className="font-brutal-mono text-xs text-neutral-500">50%</div>
            </div>
            <div>
              <div className="font-brutal-display text-3xl text-neutral-400">2º</div>
              <div className="font-brutal-mono text-xs text-neutral-500">30%</div>
            </div>
            <div>
              <div className="font-brutal-display text-3xl text-neutral-600">3º</div>
              <div className="font-brutal-mono text-xs text-neutral-500">20%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
