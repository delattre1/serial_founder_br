import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000 + Math.random() * 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: false,
        redirectTo: window.location.origin + '/',
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      alert('Erro ao fazer login com Google. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-lime-400 text-2xl animate-pulse">
          LOADING_
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Anton&display=swap');

        .font-brutal-display {
          font-family: 'Anton', Impact, sans-serif;
        }

        .font-brutal-mono {
          font-family: 'Space Mono', 'Courier New', monospace;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
          100% { transform: translate(0); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .glitch-active {
          animation: glitch 0.15s ease-in-out;
        }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to bottom, transparent, rgba(163, 230, 53, 0.15), transparent);
          animation: scanline 3s linear infinite;
          pointer-events: none;
          z-index: 100;
        }

        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 99;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(163, 230, 53, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 230, 53, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .text-stroke {
          -webkit-text-stroke: 2px white;
          color: transparent;
        }

        .marquee-container {
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          animation: marquee 25s linear infinite;
        }

        .brutal-border {
          border: 3px solid white;
          box-shadow: 6px 6px 0 0 rgba(163, 230, 53, 1);
        }

        .hover-shift:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 0 rgba(163, 230, 53, 1);
        }

        .cursor-blink::after {
          content: '_';
          animation: blink 1s step-end infinite;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
        {/* Overlays */}
        <div className="noise-overlay" />
        <div className="scanline" />

        {/* Top marquee */}
        <div className="bg-lime-400 text-black py-2 marquee-container">
          <div className="marquee-content whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-8 text-sm font-bold tracking-wider">
                /// SERIAL FOUNDERS BRASIL /// DEVS QUE LANCAM /// BUILD IN PUBLIC /// SHIP OR DIE ///
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lime-400 text-xl">[</span>
            <span className="font-brutal-display text-xl tracking-tight">SF_BR</span>
            <span className="text-lime-400 text-xl">]</span>
          </div>
          <div className="text-neutral-600 text-xs tracking-widest hidden md:block">
            // COMUNIDADE GRATUITA
          </div>
        </header>

        {/* Hackathon Winners Banner */}
        <Link to="/hackathon/winners" className="block border-y-2 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-yellow-400 text-xs tracking-widest font-brutal-mono">
                /// FINALIZADO ///
              </div>
              <div className="hidden md:block text-neutral-600">|</div>
              <h3 className="font-brutal-display text-xl md:text-2xl">
                1º HACKATON <span className="text-yellow-400">RELAMPAGO</span>
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-brutal-mono text-neutral-400 text-sm">
                CONFIRA OS TOP 3 PROJETOS
              </span>
              <span className="bg-yellow-400 text-black px-4 py-2 font-brutal-display text-sm">
                VER VENCEDORES →
              </span>
            </div>
          </div>
        </Link>

        {/* Main hero */}
        <main className="container mx-auto px-6 py-12 md:py-20 lg:py-32 flex flex-col items-center justify-center min-h-[70vh]">

          {/* Status line */}
          <div className="text-lime-400 text-xs md:text-sm mb-8 tracking-widest">
            // PARA DEVS QUE CANSARAM DE SO PLANEJAR
          </div>

          {/* Main headline */}
          <div className={`text-center mb-12 ${glitchActive ? 'glitch-active' : ''}`}>
            <h1 className="font-brutal-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight mb-4">
              PARE DE
              <br />
              <span className="text-stroke">PLANEJAR</span>
            </h1>
            <button
              onClick={handleGoogleSignIn}
              className="font-brutal-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-tight text-lime-400 hover:text-white transition-colors cursor-pointer group"
            >
              COMECE A LANCAR
              <span className="inline-block ml-2 md:ml-4 group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          {/* Subtext */}
          <div className="max-w-2xl text-center mb-12">
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-6">
              Voce tem uma ideia. Voce sabe programar.
              <br className="hidden md:block" />
              Mas seu projeto ainda esta na sua cabeca.
            </p>
            <p className="text-white text-lg md:text-xl">
              <span className="text-lime-400">Serial Founders Brasil</span> e a comunidade que
              transforma devs em founders que <span className="font-bold">LANCAM</span>.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGoogleSignIn}
            className="brutal-border bg-black px-8 md:px-12 py-4 md:py-5 text-lime-400 hover-shift transition-all duration-100 group mb-8"
          >
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-brutal-display text-xl md:text-2xl tracking-wide">
                ENTRAR COM GOOGLE
              </span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          <p className="text-neutral-600 text-sm tracking-wider">
            100% GRATIS // SEM CARTAO // SEM PEGADINHA
          </p>
        </main>

        {/* Value props */}
        <section className="border-t-2 border-neutral-800 py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="border-l-4 border-lime-400 pl-6">
                <div className="text-lime-400 text-xs tracking-widest mb-3">01_</div>
                <h3 className="font-brutal-display text-2xl md:text-3xl mb-3">ACCOUNTABILITY</h3>
                <p className="text-neutral-500 text-sm">
                  Grupo de builders que cobram uns aos outros. Sem desculpas. Sem mimimi.
                </p>
              </div>
              <div className="border-l-4 border-lime-400 pl-6">
                <div className="text-lime-400 text-xs tracking-widest mb-3">02_</div>
                <h3 className="font-brutal-display text-2xl md:text-3xl mb-3">BUILD IN PUBLIC</h3>
                <p className="text-neutral-500 text-sm">
                  Compartilhe seu progresso. Receba feedback real. Cresça com a comunidade.
                </p>
              </div>
              <div className="border-l-4 border-lime-400 pl-6">
                <div className="text-lime-400 text-xs tracking-widest mb-3">03_</div>
                <h3 className="font-brutal-display text-2xl md:text-3xl mb-3">NETWORKING</h3>
                <p className="text-neutral-500 text-sm">
                  Conecte com outros devs founders. Encontre co-founders, early users, parceiros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Manifest section */}
        <section className="border-t-2 border-neutral-800 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-neutral-600 text-xs mb-4 tracking-widest">MANIFEST.txt</div>
              <pre className="text-neutral-500 text-sm md:text-base leading-relaxed font-brutal-mono">
{`> Ideias sao lixo. Execucao e tudo.
> Feedback do mercado > sua opiniao.
> Lancou feio? Parabens, lancou.
> Perfeccionismo e desculpa de quem tem medo.
> 1 usuario pagante > 1000 likes no Twitter.
> Seu emprego CLT nao e desculpa.
> Se nao lancou, nao existe.`}
              </pre>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t-2 border-neutral-800 py-20">
          <div className="container mx-auto px-6 text-center">
            <h3 className="font-brutal-display text-3xl md:text-5xl mb-6">
              PRONTO PRA <span className="text-lime-400">LANCAR</span>?
            </h3>
            <button
              onClick={handleGoogleSignIn}
              className="bg-lime-400 text-black px-10 py-5 font-brutal-display text-xl md:text-2xl tracking-wide border-3 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0_0_rgba(0,0,0,1)] transition-all"
            >
              ENTRAR NA COMUNIDADE
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-neutral-800 p-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-neutral-600 text-sm">
              <span className="cursor-blink">SERIAL_FOUNDERS_BR</span> // 2025
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://www.youtube.com/@danedelattre"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 text-xs tracking-widest hover:text-lime-400 transition-colors"
              >
                YOUTUBE
              </a>
              <a
                href="https://www.instagram.com/danedelattre/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 text-xs tracking-widest hover:text-lime-400 transition-colors"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </footer>

        {/* Watermark */}
        <div className="fixed bottom-0 right-0 text-neutral-900 text-[12rem] md:text-[20rem] font-brutal-display leading-none pointer-events-none select-none overflow-hidden opacity-20">
          SF
        </div>
      </div>
    </>
  );
}
