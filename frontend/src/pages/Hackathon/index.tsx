import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { HackathonHero, HackathonRules, ProjectGrid, Project } from '@/components/hackathon';

export default function HackathonPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasProject, setHasProject] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [userVoteCount, setUserVoteCount] = useState(0);

  useEffect(() => {
    // Wait for auth to finish loading before fetching
    if (authLoading) return;

    async function fetchData() {
      // Fetch all submitted projects from Supabase with vote counts
      const { data: projectsData } = await supabase
        .from('hackathon_projects')
        .select('*')
        .eq('is_submitted', true);

      if (projectsData) {
        // Get vote counts for each project
        const projectsWithVotes: Project[] = await Promise.all(
          projectsData.map(async (p) => {
            // Get vote count
            const { count } = await supabase
              .from('hackathon_votes')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', p.id);

            // Check if current user has voted for this project
            let hasVoted = false;
            if (user) {
              const { data: vote } = await supabase
                .from('hackathon_votes')
                .select('id')
                .eq('project_id', p.id)
                .eq('user_id', user.id)
                .maybeSingle();
              hasVoted = !!vote;
            }

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              short_description: p.short_description,
              project_url: p.project_url,
              screenshot_url: p.screenshot_url || '',
              user_id: p.user_id,
              username: '',
              social_handle: p.social_handle || '',
              vote_count: count || 0,
              has_voted: hasVoted,
              is_solo: p.is_solo,
              team_members: Array.isArray(p.team_members) ? p.team_members.join(', ') : undefined,
            };
          })
        );
        setProjects(projectsWithVotes);
      }

      // Check if current user has a project
      if (user) {
        const { data: userProject } = await supabase
          .from('hackathon_projects')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        setHasProject(!!userProject);

        // Get user's remaining votes
        const { count: voteCount } = await supabase
          .from('hackathon_votes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setUserVoteCount(voteCount || 0);
      }

      // Voting is always open for now
      setIsVotingOpen(true);
    }

    fetchData();
  }, [user, authLoading]);

  const handleVote = async (projectId: string) => {
    if (!user) return;

    // Check if user already voted for this project
    const project = projects.find((p) => p.id === projectId);
    if (project?.has_voted) return;

    const { error } = await supabase
      .from('hackathon_votes')
      .insert({ user_id: user.id, project_id: projectId });

    if (error) {
      console.error('Error voting:', error);
      // If it's a duplicate key error, just update the UI state
      if (error.code === '23505') {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, has_voted: true } : p
          )
        );
        return;
      }
      alert('Erro ao votar. Tente novamente.');
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, vote_count: p.vote_count + 1, has_voted: true }
          : p
      )
    );
    setUserVoteCount((prev) => prev + 1);
  };

  const handleUnvote = async (projectId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('hackathon_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('project_id', projectId);

    if (error) {
      console.error('Error removing vote:', error);
      alert('Erro ao remover voto. Tente novamente.');
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, vote_count: p.vote_count - 1, has_voted: false }
          : p
      )
    );
    setUserVoteCount((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-brutal-display text-xl text-white hover:text-lime-400 transition-colors">
            SERIAL_FOUNDERS
          </Link>

          <div className="flex items-center gap-4">
            {user && isVotingOpen && userVoteCount > 0 && (
              <div className="font-brutal-mono text-xs text-lime-400">
                {userVoteCount} VOTO{userVoteCount !== 1 ? 'S' : ''}
              </div>
            )}

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

          {isVotingOpen && user && (
            <div className="brutal-border-lime bg-black/50 p-4 mb-8">
              <div className="font-brutal-mono text-sm text-lime-400">
                // VOTACAO ABERTA - Vote nos seus projetos favoritos!
              </div>
            </div>
          )}

          <ProjectGrid
            projects={projects}
            showVoting={isVotingOpen && !!user}
            onVote={handleVote}
            onUnvote={handleUnvote}
          />

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6">
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
            {user && (
              <>
                <a href="#" className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors">
                  DISCORD
                </a>
                <a href="#" className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors">
                  WHATSAPP
                </a>
              </>
            )}
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
