import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { CURRENT } from '@/config/hackathon';

interface HackathonHeroProps {
  hasProject?: boolean;
}

export function HackathonHero({ hasProject }: HackathonHeroProps) {
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: false,
        redirectTo: `${window.location.origin}/hackathon`,
      },
    });
  };

  return (
    <section className="relative py-16 md:py-24 px-4">
      {/* Marquee bar */}
      <div className="absolute top-0 left-0 right-0 bg-lime-400 text-black py-2 marquee-container">
        <div className="marquee-content font-brutal-mono text-sm tracking-widest">
          {`${CURRENT.marquee} ${CURRENT.marquee} `}&nbsp;
          {`${CURRENT.marquee} ${CURRENT.marquee} `}&nbsp;
        </div>
      </div>

      <div className="max-w-5xl mx-auto pt-12">
        {/* Event label */}
        <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
          {CURRENT.label}
        </div>

        {/* Main headline */}
        <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-2">
          {CURRENT.tagline1}
        </h1>
        <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl text-stroke-lime leading-none mb-8">
          {CURRENT.tagline2}
        </h1>

        {/* Dates */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="brutal-border bg-black px-6 py-3">
            <span className="font-brutal-mono text-lime-400 text-lg">{CURRENT.dates.startLabel}</span>
          </div>
          <span className="text-neutral-600 text-2xl">→</span>
          <div className="brutal-border bg-black px-6 py-3">
            <span className="font-brutal-mono text-lime-400 text-lg">{CURRENT.dates.endLabel}</span>
          </div>
        </div>

        {/* Subinfo */}
        <div className="font-brutal-mono text-neutral-400 text-sm mb-8 space-y-1">
          {CURRENT.dates.subinfo.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-wrap gap-4">
          {!user ? (
            <button
              onClick={handleGoogleLogin}
              className="bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono text-lg tracking-wider hover-shift-dark"
            >
              PARTICIPAR COM GOOGLE
            </button>
          ) : hasProject ? (
            <Link
              to="/hackathon/my-project"
              className="bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono text-lg tracking-wider hover-shift-dark inline-block"
            >
              MEU PROJETO
            </Link>
          ) : (
            <Link
              to="/hackathon/register"
              className="bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono text-lg tracking-wider hover-shift-dark inline-block"
            >
              REGISTRAR PROJETO
            </Link>
          )}

          <Link
            to="/hackathon/desafio"
            className="brutal-border bg-black px-6 py-4 text-white font-brutal-mono hover-shift inline-block"
          >
            [VER O DESAFIO]
          </Link>

          <button
            onClick={() => document.getElementById('regras')?.scrollIntoView({ behavior: 'smooth' })}
            className="brutal-border bg-black px-6 py-4 text-white font-brutal-mono hover-shift"
          >
            [VER REGRAS]
          </button>
        </div>

        {/* Status indicator */}
        {user && (
          <div className="mt-6 font-brutal-mono text-xs text-lime-400">
            // STATUS: AUTHENTICATED AS {user.email?.split('@')[0].toUpperCase()}
          </div>
        )}
      </div>
    </section>
  );
}
