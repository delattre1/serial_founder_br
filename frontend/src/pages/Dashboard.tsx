import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const openDiscord = () => window.open('https://discord.gg/pAuaaXmrr9', '_blank');
  const openWhatsApp = () => window.open('https://chat.whatsapp.com/J0ritHTWNcs5omHUskehHD', '_blank');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-lime-400 text-2xl animate-pulse">
          LOADING_
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'FOUNDER';

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

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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

        .cursor-blink::after {
          content: '_';
          animation: blink 1s step-end infinite;
        }

        .marquee-container {
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
        }

        .brutal-border {
          border: 3px solid white;
          box-shadow: 6px 6px 0 0 rgba(163, 230, 53, 1);
        }

        .brutal-border-inverse {
          border: 3px solid black;
          box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 1);
        }

        .hover-shift:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 0 rgba(163, 230, 53, 1);
        }

        .hover-shift-dark:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 0 rgba(0, 0, 0, 1);
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

        .text-stroke {
          -webkit-text-stroke: 2px white;
          color: transparent;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(163, 230, 53, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 230, 53, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
        {/* Noise overlay */}
        <div className="noise-overlay" />

        {/* Scanline effect */}
        <div className="scanline" />

        {/* Top marquee bar */}
        <div className="bg-lime-400 text-black py-2 marquee-container">
          <div className="marquee-content whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-8 text-sm font-bold tracking-wider">
                /// SERIAL FOUNDERS BRASIL /// BUILD IN PUBLIC /// SHIP OR DIE /// NO EXCUSES ///
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="border-b-3 border-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-lime-400 text-xl">[</span>
            <span className="font-brutal-display text-2xl tracking-tight">SERIAL_FOUNDERS</span>
            <span className="text-lime-400 text-xl">]</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-neutral-500 text-sm hidden md:block">
              USER: <span className="text-white">{userName.toUpperCase()}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="border-2 border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors duration-100 tracking-wider"
            >
              [SAIR]
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero section */}
          <div className={`mb-16 ${glitchActive ? 'glitch-active' : ''}`}>
            <div className="text-lime-400 text-sm mb-4 tracking-widest">
              // STATUS: AUTHENTICATED
            </div>
            <h1 className="font-brutal-display text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight mb-6">
              BEM-VINDO,
              <br />
              <span className="text-stroke">{userName.toUpperCase()}</span>
            </h1>
            <div className="max-w-2xl">
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                Agora voce faz parte de um coletivo de
                <span className="text-lime-400"> BUILDERS</span> obstinados.
                <br />
                Sem desculpas. Sem mimimi. So
                <span className="text-white font-bold"> EXECUCAO</span>.
              </p>
            </div>
          </div>

          {/* Manifest block */}
          <div className="border-l-4 border-lime-400 pl-6 mb-16 py-4">
            <div className="text-neutral-600 text-xs mb-2 tracking-widest">MANIFEST.txt</div>
            <pre className="text-neutral-500 text-sm md:text-base leading-relaxed">
{`> Ideias sao lixo. Execucao e tudo.
> Feedback do mercado > sua opiniao.
> Lancou feio? Parabens, lancou.
> Perfeccionismo e desculpa de quem tem medo.
> 1 usuario pagante > 1000 likes no Twitter.`}
            </pre>
          </div>

          {/* Action cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Discord Card */}
            <button
              onClick={openDiscord}
              className="brutal-border bg-black p-8 text-left hover-shift transition-all duration-100 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-lime-400 text-xs tracking-widest">CANAL_01</div>
                <svg className="w-8 h-8 text-white group-hover:text-lime-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="font-brutal-display text-4xl md:text-5xl mb-4 group-hover:text-lime-400 transition-colors">
                DISCORD
              </h3>
              <p className="text-neutral-500 mb-6">
                Discussoes em tempo real. Networking. Accountability groups. Onde a magia acontece.
              </p>
              <div className="flex items-center gap-2 text-lime-400 text-sm tracking-widest">
                <span>ENTRAR</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </button>

            {/* WhatsApp Card */}
            <button
              onClick={openWhatsApp}
              className="bg-lime-400 text-black p-8 text-left brutal-border-inverse hover-shift-dark transition-all duration-100 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-black/60 text-xs tracking-widest">CANAL_02</div>
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="font-brutal-display text-4xl md:text-5xl mb-4">
                WHATSAPP
              </h3>
              <p className="text-black/70 mb-6">
                Updates rapidos. Links uteis. Oportunidades exclusivas. Direto no seu bolso.
              </p>
              <div className="flex items-center gap-2 text-black text-sm tracking-widest">
                <span>ENTRAR</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </button>
          </div>

          {/* Stats/Info bar */}
          <div className="border-t-2 border-b-2 border-neutral-800 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-lime-400 font-brutal-display text-3xl md:text-4xl">100+</div>
              <div className="text-neutral-600 text-xs tracking-widest mt-1">FOUNDERS</div>
            </div>
            <div>
              <div className="text-lime-400 font-brutal-display text-3xl md:text-4xl">24/7</div>
              <div className="text-neutral-600 text-xs tracking-widest mt-1">SUPORTE</div>
            </div>
            <div>
              <div className="text-lime-400 font-brutal-display text-3xl md:text-4xl">0</div>
              <div className="text-neutral-600 text-xs tracking-widest mt-1">BULLSHIT</div>
            </div>
            <div>
              <div className="text-lime-400 font-brutal-display text-3xl md:text-4xl">∞</div>
              <div className="text-neutral-600 text-xs tracking-widest mt-1">POTENCIAL</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-neutral-800 p-6 mt-auto">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-neutral-600 text-sm">
              <span className="cursor-blink">SERIAL_FOUNDERS_BR</span> // 2024
            </div>
            <div className="text-neutral-700 text-xs tracking-widest">
              BUILT BY BUILDERS, FOR BUILDERS
            </div>
          </div>
        </footer>

        {/* Corner decoration */}
        <div className="fixed bottom-0 right-0 text-neutral-900 text-[12rem] md:text-[20rem] font-brutal-display leading-none pointer-events-none select-none overflow-hidden opacity-30">
          SF
        </div>
      </div>
    </>
  );
}
