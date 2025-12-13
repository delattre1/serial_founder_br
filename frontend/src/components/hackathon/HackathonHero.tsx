import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

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
          /// HACKATON RELAMPAGO /// DO ZERO AO DEPLOY /// 12-14 DEZ 2024 /// SHIP OR DIE /// HACKATON RELAMPAGO /// DO ZERO AO DEPLOY /// 12-14 DEZ 2024 /// SHIP OR DIE ///&nbsp;
          /// HACKATON RELAMPAGO /// DO ZERO AO DEPLOY /// 12-14 DEZ 2024 /// SHIP OR DIE /// HACKATON RELAMPAGO /// DO ZERO AO DEPLOY /// 12-14 DEZ 2024 /// SHIP OR DIE ///&nbsp;
        </div>
      </div>

      <div className="max-w-5xl mx-auto pt-12">
        {/* Event label */}
        <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
          // 1º HACKATON RELAMPAGO
        </div>

        {/* Main headline */}
        <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-2">
          DO ZERO
        </h1>
        <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl text-stroke-lime leading-none mb-8">
          AO DEPLOY
        </h1>

        {/* Dates */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="brutal-border bg-black px-6 py-3">
            <span className="font-brutal-mono text-lime-400 text-lg">12/12 22:30</span>
          </div>
          <span className="text-neutral-600 text-2xl">→</span>
          <div className="brutal-border bg-black px-6 py-3">
            <span className="font-brutal-mono text-lime-400 text-lg">14/12 20:00</span>
          </div>
        </div>

        {/* Subinfo */}
        <div className="font-brutal-mono text-neutral-400 text-sm mb-8 space-y-1">
          <p>// ABERTURA: 12/12 às 21h (YouTube + Instagram)</p>
          <p>// APRESENTACOES + VOTACAO: 14/12 às 20h</p>
          <p>// DISCORD: Aberto a partir das 12h</p>
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
