import { Zap, Trophy } from 'lucide-react';

interface PaymentChoiceProps {
  onSelect: (wantsToPay: boolean) => void;
}

export function PaymentChoice({ onSelect }: PaymentChoiceProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
        // PASSO 1 DE 2
      </div>

      <h2 className="font-brutal-display text-4xl md:text-5xl text-white mb-8">
        COMO VOCE QUER PARTICIPAR?
      </h2>

      <div className="grid gap-6">
        {/* Free option */}
        <button
          onClick={() => onSelect(false)}
          className="brutal-border bg-black p-8 text-left hover-shift group"
        >
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-lime-400 flex-shrink-0" />
            <div>
              <h3 className="font-brutal-display text-2xl text-white mb-2 group-hover:text-lime-400 transition-colors">
                [GRATIS]
              </h3>
              <p className="font-brutal-mono text-neutral-400 text-sm">
                Participa sem pagar nada.
              </p>
              <p className="font-brutal-mono text-neutral-600 text-sm mt-1">
                Sem premiacao para os vencedores.
              </p>
            </div>
          </div>
        </button>

        {/* Paid option */}
        <button
          onClick={() => onSelect(true)}
          className="bg-lime-400 text-black brutal-border-inverse p-8 text-left hover-shift-dark group"
        >
          <div className="flex items-start gap-4">
            <Trophy className="w-8 h-8 text-black flex-shrink-0" />
            <div>
              <h3 className="font-brutal-display text-2xl text-black mb-2">
                [R$ 20 - COM PREMIACAO]
              </h3>
              <p className="font-brutal-mono text-black/70 text-sm">
                Valor vai para premiar os Top 3 projetos.
              </p>
              <p className="font-brutal-mono text-black/50 text-sm mt-1">
                Todos que pagarem concorrem aos premios.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-black/20">
            <div className="font-brutal-mono text-xs text-black/60">
              // PIX: Pagamento instantaneo
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 font-brutal-mono text-xs text-neutral-600 text-center">
        // VOCE PODE MUDAR ESSA ESCOLHA DEPOIS
      </div>
    </div>
  );
}
