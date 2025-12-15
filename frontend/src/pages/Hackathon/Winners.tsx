import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Loader2, Trophy, Medal, Award, Crown, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WinnerProject {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  project_url: string;
  screenshot_url: string;
  social_handle: string;
  github_url?: string;
  vote_count: number;
  is_solo: boolean;
  team_members?: string;
}

const WINNER_SLUGS = [
  'projeto-do-dixon-ainda-definindo-mj5qqw9g',
  'stackbuilder-mj4fdp0a',
  'zynance-mj3v6m4z',
];

export default function WinnersPage() {
  const [winners, setWinners] = useState<(WinnerProject | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function fetchWinners() {
      const winnersData: (WinnerProject | null)[] = [];

      for (const slug of WINNER_SLUGS) {
        const { data, error } = await supabase
          .from('hackathon_projects')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error || !data) {
          winnersData.push(null);
          continue;
        }

        // Get vote count
        const { count } = await supabase
          .from('hackathon_votes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', data.id);

        winnersData.push({
          id: data.id,
          name: data.name,
          slug: data.slug,
          short_description: data.short_description,
          project_url: data.project_url,
          screenshot_url: data.screenshot_url || '',
          social_handle: data.social_handle || '',
          github_url: data.github_url || '',
          vote_count: count || 0,
          is_solo: data.is_solo,
          team_members: Array.isArray(data.team_members) ? data.team_members.join(', ') : '',
        });
      }

      setWinners(winnersData);
      setLoading(false);

      // Trigger confetti after load
      setTimeout(() => setShowConfetti(true), 500);
    }

    fetchWinners();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
      </div>
    );
  }

  const [first, second, third] = winners;

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
            [VER TODOS PROJETOS]
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center z-10">
        <div className="inline-flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <span className="font-brutal-mono text-yellow-400 text-sm tracking-widest">
            HACKATHON SERIAL FOUNDERS 2025
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
          <span>OS PROJETOS MAIS VOTADOS DA COMUNIDADE</span>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
      </section>

      {/* Podium Section */}
      <section className="relative py-8 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Podium Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-end">
            {/* Second Place - Left */}
            {second && (
              <div className="order-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <WinnerCard project={second} place={2} />
              </div>
            )}

            {/* First Place - Center (Taller) */}
            {first && (
              <div className="order-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <WinnerCard project={first} place={1} />
              </div>
            )}

            {/* Third Place - Right */}
            {third && (
              <div className="order-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <WinnerCard project={third} place={3} />
              </div>
            )}
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-8">
            {first && <WinnerCard project={first} place={1} />}
            {second && <WinnerCard project={second} place={2} />}
            {third && <WinnerCard project={third} place={3} />}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 text-center z-10">
        <div className="max-w-2xl mx-auto">
          <div className="brutal-border-lime bg-black/80 p-8">
            <Trophy className="w-12 h-12 text-lime-400 mx-auto mb-4" />
            <h3 className="font-brutal-display text-2xl text-white mb-4">
              PARABENS A TODOS OS PARTICIPANTES!
            </h3>
            <p className="font-brutal-mono text-neutral-400 text-sm mb-6">
              Cada projeto representa horas de dedicacao e criatividade.
              Obrigado por fazer parte do Hackathon Serial Founders!
            </p>
            <Link
              to="/hackathon"
              className="inline-block bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono hover-shift-dark"
            >
              VER TODOS OS PROJETOS
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-brutal-mono text-xs text-neutral-600">
            // SERIAL_FOUNDERS_BR © 2025
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

function WinnerCard({ project, place }: { project: WinnerProject; place: 1 | 2 | 3 }) {
  const placeConfig = {
    1: {
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
      shadowColor: 'rgba(250, 204, 21, 0.5)',
      label: '1º LUGAR',
      size: 'scale-105',
      iconSize: 'w-10 h-10',
    },
    2: {
      icon: Medal,
      color: 'text-neutral-300',
      bgColor: 'bg-neutral-300',
      borderColor: 'border-neutral-300',
      shadowColor: 'rgba(212, 212, 212, 0.5)',
      label: '2º LUGAR',
      size: 'scale-100',
      iconSize: 'w-8 h-8',
    },
    3: {
      icon: Award,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400',
      borderColor: 'border-orange-400',
      shadowColor: 'rgba(251, 146, 60, 0.5)',
      label: '3º LUGAR',
      size: 'scale-100',
      iconSize: 'w-8 h-8',
    },
  };

  const config = placeConfig[place];
  const Icon = config.icon;

  const placeholderScreenshot = `https://placehold.co/600x400/000000/a3e635?text=${encodeURIComponent(project.name)}`;

  return (
    <div
      className={`relative ${config.size} transition-transform duration-500`}
    >
      {/* Place Badge */}
      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 ${config.bgColor} text-black px-4 py-2 font-brutal-mono text-sm`}>
        <Icon className="w-5 h-5" />
        <span className="font-bold">{config.label}</span>
      </div>

      {/* Card */}
      <div
        className={`bg-black border-3 ${config.borderColor} pt-8`}
        style={{ boxShadow: `8px 8px 0 0 ${config.shadowColor}` }}
      >
        {/* Screenshot */}
        <div className="aspect-video overflow-hidden bg-neutral-900 mx-4 mb-4">
          <img
            src={project.screenshot_url || placeholderScreenshot}
            alt={project.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <h3 className="font-brutal-display text-2xl text-white mb-2 truncate">
            {project.name.toUpperCase()}
          </h3>

          {project.social_handle && (
            <p className={`font-brutal-mono text-xs ${config.color} mb-3`}>
              @{project.social_handle}
            </p>
          )}

          <p className="font-brutal-mono text-sm text-neutral-400 mb-4 line-clamp-2">
            {project.short_description}
          </p>

          {/* Vote Count */}
          <div className={`flex items-center gap-2 mb-4 ${config.color}`}>
            <span className="font-brutal-display text-3xl">{project.vote_count}</span>
            <span className="font-brutal-mono text-xs">VOTOS</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 ${config.bgColor} text-black py-2 px-3 font-brutal-mono text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <ExternalLink className="w-4 h-4" />
              VER PROJETO
            </a>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`border-2 ${config.borderColor} ${config.color} py-2 px-3 font-brutal-mono text-xs flex items-center justify-center hover:bg-white/5 transition-colors`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Link to full project page */}
          <Link
            to={`/hackathon/project/${project.slug}`}
            className="block mt-3 text-center font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
          >
            [VER DETALHES COMPLETOS]
          </Link>
        </div>
      </div>
    </div>
  );
}
