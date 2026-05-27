import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Trophy, Medal, Award, Crown, Sparkles } from 'lucide-react';
import { ROUND1_ARCHIVE, StaticWinner } from '@/config/hackathon';

export default function WinnersPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(t);
  }, []);

  const byPlace = (p: number) => ROUND1_ARCHIVE.winners.find((w) => w.place === p);
  const first = byPlace(1);
  const second = byPlace(2);
  const third = byPlace(3);

  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono relative overflow-hidden">
      {/* Animated background */}
      <div className="winner-bg" />
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Confetti particles */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#a3e635', '#facc15', '#f97316', '#ffffff'][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/hackathon" className="font-brutal-display text-xl text-white hover:text-lime-400 transition-colors">
            SERIAL_FOUNDERS
          </Link>
          <Link
            to="/hackathon"
            className="border-2 border-neutral-600 px-4 py-2 text-sm hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            [VER HACKATHON ATUAL]
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center z-10">
        <div className="inline-flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <span className="font-brutal-mono text-yellow-400 text-sm tracking-widest">
            {ROUND1_ARCHIVE.edition} {ROUND1_ARCHIVE.name} // {ROUND1_ARCHIVE.dateLabel}
          </span>
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>

        <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl text-white mb-4 winner-title">
          TOP 3
        </h1>
        <h2 className="font-brutal-display text-4xl md:text-5xl lg:text-6xl text-stroke-lime mb-8">
          VENCEDORES
        </h2>

        <div className="flex items-center justify-center gap-4 text-neutral-500 font-brutal-mono text-xs">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>SELECIONADOS PELA CURADORIA · {ROUND1_ARCHIVE.subtitle}</span>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
      </section>

      {/* Podium Section */}
      <section className="relative py-8 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Podium Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-end">
            {second && (
              <div className="order-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <WinnerCard winner={second} />
              </div>
            )}
            {first && (
              <div className="order-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <WinnerCard winner={first} />
              </div>
            )}
            {third && (
              <div className="order-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <WinnerCard winner={third} />
              </div>
            )}
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-8">
            {first && <WinnerCard winner={first} />}
            {second && <WinnerCard winner={second} />}
            {third && <WinnerCard winner={third} />}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 text-center z-10">
        <div className="max-w-2xl mx-auto">
          <div className="brutal-border-lime bg-black/80 p-8">
            <Trophy className="w-12 h-12 text-lime-400 mx-auto mb-4" />
            <h3 className="font-brutal-display text-2xl text-white mb-4">
              A 2ª EDICAO JA COMECOU!
            </h3>
            <p className="font-brutal-mono text-neutral-400 text-sm mb-6">
              SEED EDITION. Do zero ao deploy. Inscreva-se e mostre o que voce constroi.
            </p>
            <Link
              to="/hackathon"
              className="inline-block bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono hover-shift-dark"
            >
              PARTICIPAR AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-brutal-mono text-xs text-neutral-600">
            // SERIAL_FOUNDERS_BR © 2026
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.youtube.com/@danedelattre"
              target="_blank"
              rel="noopener noreferrer"
              className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              YOUTUBE
            </a>
            <a
              href="https://www.instagram.com/danedelattre/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 text-yellow-400/20 text-8xl font-brutal-display pointer-events-none select-none animate-float">
        1
      </div>
      <div className="fixed bottom-20 right-10 text-lime-400/10 text-[20rem] font-brutal-display pointer-events-none select-none leading-none">
        SF
      </div>
    </div>
  );
}

function WinnerCard({ winner }: { winner: StaticWinner }) {
  const placeConfig = {
    1: { icon: Trophy, color: 'text-yellow-400', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400', shadowColor: 'rgba(250, 204, 21, 0.5)', label: '1º LUGAR', size: 'scale-105' },
    2: { icon: Medal, color: 'text-neutral-300', bgColor: 'bg-neutral-300', borderColor: 'border-neutral-300', shadowColor: 'rgba(212, 212, 212, 0.5)', label: '2º LUGAR', size: 'scale-100' },
    3: { icon: Award, color: 'text-orange-400', bgColor: 'bg-orange-400', borderColor: 'border-orange-400', shadowColor: 'rgba(251, 146, 60, 0.5)', label: '3º LUGAR', size: 'scale-100' },
  } as const;

  const config = placeConfig[winner.place];
  const Icon = config.icon;
  const placeholderScreenshot = `https://placehold.co/600x400/000000/a3e635?text=${encodeURIComponent(winner.name)}`;

  return (
    <div className={`relative ${config.size} transition-transform duration-500`}>
      {/* Place Badge */}
      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 ${config.bgColor} text-black px-4 py-2 font-brutal-mono text-sm`}>
        <Icon className="w-5 h-5" />
        <span className="font-bold">{config.label}</span>
      </div>

      {/* Card */}
      <div className={`bg-black border-3 ${config.borderColor} pt-8`} style={{ boxShadow: `8px 8px 0 0 ${config.shadowColor}` }}>
        {/* Screenshot */}
        <div className="aspect-video overflow-hidden bg-neutral-900 mx-4 mb-4">
          <img
            src={winner.screenshotUrl || placeholderScreenshot}
            alt={winner.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <h3 className="font-brutal-display text-2xl text-white mb-2 truncate">
            {winner.name.toUpperCase()}
          </h3>

          {winner.handle && (
            <p className={`font-brutal-mono text-xs ${config.color} mb-3`}>@{winner.handle}</p>
          )}

          {winner.description && (
            <p className="font-brutal-mono text-sm text-neutral-400 mb-4 line-clamp-2">
              {winner.description}
            </p>
          )}

          {/* Actions (only render links that exist) */}
          {(winner.projectUrl || winner.githubUrl) && (
            <div className="flex gap-2">
              {winner.projectUrl && (
                <a
                  href={winner.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 ${config.bgColor} text-black py-2 px-3 font-brutal-mono text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                >
                  <ExternalLink className="w-4 h-4" />
                  VER PROJETO
                </a>
              )}
              {winner.githubUrl && (
                <a
                  href={winner.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border-2 ${config.borderColor} ${config.color} py-2 px-3 font-brutal-mono text-xs flex items-center justify-center hover:bg-white/5 transition-colors`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
