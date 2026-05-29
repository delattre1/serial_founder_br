import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { HackathonHero, HackathonRules, ProjectGrid, Project, DeadlineBanner } from '@/components/hackathon';
import { CURRENT_ROUND } from '@/config/hackathon';

export default function HackathonPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasProject, setHasProject] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before fetching
    if (authLoading) return;

    async function fetchData() {
      // Fetch all submitted projects for the current round
      const { data: projectsData } = await supabase
        .from('hackathon_projects')
        .select('*')
        .eq('round', CURRENT_ROUND)
        .eq('is_submitted', true);

      if (projectsData) {
        setProjects(
          projectsData.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            short_description: p.short_description,
            project_url: p.project_url,
            screenshot_url: p.screenshot_url || '',
            user_id: p.user_id,
            username: '',
            social_handle: p.social_handle || '',
          }))
        );
      }

      // Check if current user has a project in this round
      if (user) {
        const { data: userProject } = await supabase
          .from('hackathon_projects')
          .select('id')
          .eq('user_id', user.id)
          .eq('round', CURRENT_ROUND)
          .maybeSingle();

        setHasProject(!!userProject);
      }
    }

    fetchData();
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Deadline banner */}
      <DeadlineBanner />

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-brutal-display text-xl text-white hover:text-lime-400 transition-colors">
            SERIAL_FOUNDERS
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-brutal-mono text-xs text-neutral-500">
                  {user.email?.split('@')[0]}
                </span>
                <Link
                  to="/dashboard"
                  className="border-2 border-neutral-600 px-4 py-2 text-sm hover:border-lime-400 hover:text-lime-400 transition-colors"
                >
                  [DASHBOARD]
                </Link>
              </div>
            ) : (
              <Link
                to="/"
                className="border-2 border-lime-400 text-lime-400 px-4 py-2 text-sm hover:bg-lime-400 hover:text-black transition-colors"
              >
                [ENTRAR]
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HackathonHero hasProject={hasProject} />

      {/* Rules Section */}
      <HackathonRules />

      {/* Projects Section */}
      <section className="py-16 px-4 border-t-2 border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-brutal-display text-4xl md:text-5xl text-white">
              PROJETOS PARTICIPANTES
            </h2>
            <div className="font-brutal-mono text-sm text-neutral-500">
              {projects.length} PROJETO{projects.length !== 1 ? 'S' : ''}
            </div>
          </div>

          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6">
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

      {/* Large watermark decoration */}
      <div className="fixed bottom-0 right-0 text-neutral-900 text-[15rem] md:text-[20rem] font-brutal-display opacity-20 pointer-events-none select-none leading-none">
        SF
      </div>
    </div>
  );
}
