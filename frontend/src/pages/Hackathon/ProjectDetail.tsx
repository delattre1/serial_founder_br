import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { VoteButton, Project } from '@/components/hackathon';

interface ProjectDetail extends Project {
  full_description?: string;
  how_it_was_built?: string;
  social_handle?: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      // Fetch project by slug first, then try by id
      let { data, error } = await supabase
        .from('hackathon_projects')
        .select('*')
        .eq('slug', id)
        .maybeSingle();

      // If not found by slug, try by id (UUID)
      if (!data && !error) {
        const result = await supabase
          .from('hackathon_projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Get vote count
        const { count } = await supabase
          .from('hackathon_votes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', data.id);

        // Check if current user has voted
        let hasVoted = false;
        if (user) {
          const { data: vote } = await supabase
            .from('hackathon_votes')
            .select('id')
            .eq('project_id', data.id)
            .eq('user_id', user.id)
            .maybeSingle();
          hasVoted = !!vote;
        }

        setProject({
          id: data.id,
          name: data.name,
          slug: data.slug,
          short_description: data.short_description,
          full_description: data.full_description || '',
          how_it_was_built: data.how_it_was_built || '',
          project_url: data.project_url,
          github_url: data.github_url || '',
          screenshot_url: data.screenshot_url || '',
          user_id: data.user_id,
          username: '',
          social_handle: data.social_handle || '',
          vote_count: count || 0,
          has_voted: hasVoted,
          is_solo: data.is_solo,
          team_members: Array.isArray(data.team_members) ? data.team_members.join(', ') : '',
        });
      }

      setLoading(false);
    }

    fetchProject();
  }, [id, user]);

  const handleVote = async () => {
    if (!project || !user) return;

    const { error } = await supabase
      .from('hackathon_votes')
      .insert({ user_id: user.id, project_id: project.id });

    if (error) {
      console.error('Error voting:', error);
      alert('Erro ao votar. Tente novamente.');
      return;
    }

    setProject((prev) =>
      prev ? { ...prev, vote_count: prev.vote_count + 1, has_voted: true } : null
    );
  };

  const handleUnvote = async () => {
    if (!project || !user) return;

    const { error } = await supabase
      .from('hackathon_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('project_id', project.id);

    if (error) {
      console.error('Error removing vote:', error);
      alert('Erro ao remover voto. Tente novamente.');
      return;
    }

    setProject((prev) =>
      prev ? { ...prev, vote_count: prev.vote_count - 1, has_voted: false } : null
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-brutal-display text-4xl mb-4">PROJETO NAO ENCONTRADO</h1>
          <Link to="/hackathon" className="text-lime-400 font-brutal-mono hover:underline">
            Voltar para hackathon
          </Link>
        </div>
      </div>
    );
  }

  const placeholderScreenshot = `https://placehold.co/1200x675/000000/a3e635?text=${encodeURIComponent(project.name)}`;

  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/hackathon"
            className="flex items-center gap-2 font-brutal-mono text-sm text-neutral-400 hover:text-lime-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>

          <div className="font-brutal-display text-xl text-white">
            SERIAL_FOUNDERS
          </div>

          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Project header */}
          <div className="mb-8">
            <div className="text-lime-400 text-xs tracking-widest mb-4">
              // PROJETO PARTICIPANTE
            </div>
            <h1 className="font-brutal-display text-5xl md:text-6xl text-white mb-4">
              {project.name.toUpperCase()}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-neutral-500 font-brutal-mono text-sm">
              {project.social_handle && (
                <>
                  <span>por @{project.social_handle}</span>
                  <span className="text-neutral-700">•</span>
                </>
              )}
              <span>{project.is_solo ? 'Solo' : `Equipe: ${project.team_members}`}</span>
            </div>
          </div>

          {/* Preview area */}
          <div className="brutal-border bg-black mb-8">
            <div className="relative aspect-video overflow-hidden bg-neutral-900">
              {!showIframe ? (
                <>
                  <img
                    src={project.screenshot_url || placeholderScreenshot}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setShowIframe(true)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span className="bg-lime-400 text-black px-6 py-3 font-brutal-mono">
                      VER PREVIEW AO VIVO
                    </span>
                  </button>
                </>
              ) : (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
                    </div>
                  )}
                  <iframe
                    src={project.project_url}
                    className={`w-full h-full border-0 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={() => setIframeLoaded(true)}
                    title={`Preview of ${project.name}`}
                  />
                  <button
                    onClick={() => {
                      setShowIframe(false);
                      setIframeLoaded(false);
                    }}
                    className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 font-brutal-mono text-xs"
                  >
                    [FECHAR]
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-lime-400 text-black brutal-border-inverse px-6 py-3 font-brutal-mono flex items-center gap-2 hover-shift-dark"
            >
              <ExternalLink className="w-4 h-4" />
              ACESSAR PROJETO
            </a>

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-border bg-black px-6 py-3 text-white font-brutal-mono flex items-center gap-2 hover-shift"
              >
                <Github className="w-4 h-4" />
                GITHUB
              </a>
            )}

            <VoteButton
              projectId={project.id}
              voteCount={project.vote_count}
              hasVoted={project.has_voted || false}
              onVote={handleVote}
              onUnvote={handleUnvote}
            />
          </div>

          {/* Description */}
          {project.full_description && (
            <section className="mb-12">
              <h2 className="font-brutal-display text-2xl text-white mb-6 border-b-2 border-neutral-800 pb-4">
                SOBRE O PROJETO
              </h2>
              <div className="prose prose-invert prose-lime max-w-none font-brutal-mono text-neutral-300 leading-relaxed">
                {/* Simple markdown rendering - could use a proper markdown library */}
                {project.full_description.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return (
                      <h3 key={i} className="font-brutal-display text-xl text-white mt-6 mb-4">
                        {line.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={i} className="font-brutal-display text-lg text-lime-400 mt-4 mb-2">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                        <span className="text-lime-400">•</span>
                        <span dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      </div>
                    );
                  }
                  if (/^\d+\.\s/.test(line)) {
                    const num = line.match(/^(\d+)\./)?.[1];
                    return (
                      <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                        <span className="text-lime-400 font-bold">{num}.</span>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      </div>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={i} className="h-4" />;
                  }
                  return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />;
                })}
              </div>
            </section>
          )}

          {/* How it was built */}
          {project.how_it_was_built && (
            <section>
              <h2 className="font-brutal-display text-2xl text-white mb-6 border-b-2 border-neutral-800 pb-4">
                COMO FOI CONSTRUIDO
              </h2>
              <div className="prose prose-invert prose-lime max-w-none font-brutal-mono text-neutral-300 leading-relaxed">
                {project.how_it_was_built.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={i} className="font-brutal-display text-lg text-lime-400 mt-4 mb-2">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                        <span className="text-lime-400">•</span>
                        <span dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      </div>
                    );
                  }
                  if (/^\d+\.\s/.test(line)) {
                    const num = line.match(/^(\d+)\./)?.[1];
                    return (
                      <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                        <span className="text-lime-400 font-bold">{num}.</span>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      </div>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={i} className="h-4" />;
                  }
                  return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />;
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="font-brutal-mono text-xs text-neutral-600">
            // SERIAL_FOUNDERS_BR © 2025
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
