import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { RegistrationForm, ProjectFormData } from '@/components/hackathon';

interface UserProject extends ProjectFormData {
  id: string;
  is_submitted: boolean;
  slug: string;
}

export default function MyProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<UserProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!user) return;

      const { data, error } = await supabase
        .from('hackathon_projects')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching project:', error);
      }

      if (data) {
        setProject({
          id: data.id,
          slug: data.slug,
          name: data.name,
          short_description: data.short_description,
          full_description: data.full_description || '',
          how_it_was_built: data.how_it_was_built || '',
          project_url: data.project_url,
          github_url: data.github_url || '',
          is_solo: data.is_solo,
          team_members: Array.isArray(data.team_members) ? data.team_members.join(', ') : '',
          screenshot_url: data.screenshot_url || '',
          is_submitted: data.is_submitted,
        });
      }

      setLoading(false);
    }

    if (!authLoading && user) {
      fetchProject();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Redirect to hackathon page if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/hackathon" replace />;
  }

  // Redirect to register if user has no project
  if (!loading && !project) {
    return <Navigate to="/hackathon/register" replace />;
  }

  const handleSubmit = async (data: ProjectFormData) => {
    if (!project) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('hackathon_projects')
        .update({
          name: data.name,
          short_description: data.short_description,
          full_description: data.full_description || null,
          how_it_was_built: data.how_it_was_built || null,
          project_url: data.project_url,
          github_url: data.github_url || null,
          screenshot_url: data.screenshot_url || null,
          team_members: data.is_solo ? [] : data.team_members.split(',').map((m) => m.trim()),
          is_solo: data.is_solo,
          is_submitted: true,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject((prev) => (prev ? { ...prev, ...data, is_submitted: true } : null));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Erro ao atualizar projeto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (data: ProjectFormData) => {
    if (!project) return;

    try {
      const { error } = await supabase
        .from('hackathon_projects')
        .update({
          name: data.name,
          short_description: data.short_description,
          full_description: data.full_description || null,
          how_it_was_built: data.how_it_was_built || null,
          project_url: data.project_url,
          github_url: data.github_url || null,
          screenshot_url: data.screenshot_url || null,
          team_members: data.is_solo ? [] : data.team_members.split(',').map((m) => m.trim()),
          is_solo: data.is_solo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject((prev) => (prev ? { ...prev, ...data } : null));
      alert('Rascunho salvo!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Erro ao salvar rascunho. Tente novamente.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
      </div>
    );
  }

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

          <div className="font-brutal-mono text-xs text-neutral-600">
            {user?.email?.split('@')[0]}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {!isEditing ? (
            <>
              {/* Project overview */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lime-400 text-xs tracking-widest">
                    // MEU PROJETO
                  </div>
                  <div
                    className={`px-3 py-1 text-xs font-brutal-mono ${
                      project?.is_submitted
                        ? 'bg-lime-400 text-black'
                        : 'border border-neutral-600 text-neutral-400'
                    }`}
                  >
                    {project?.is_submitted ? 'SUBMETIDO' : 'RASCUNHO'}
                  </div>
                </div>

                <h1 className="font-brutal-display text-5xl md:text-6xl text-white mb-4">
                  {project?.name.toUpperCase()}
                </h1>

                <p className="font-brutal-mono text-neutral-400 text-lg mb-8">
                  {project?.short_description}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="brutal-border bg-black px-6 py-3 text-white font-brutal-mono hover-shift"
                  >
                    [EDITAR PROJETO]
                  </button>

                  <Link
                    to={`/hackathon/project/${project?.slug}`}
                    className="border-2 border-neutral-600 px-6 py-3 text-neutral-400 font-brutal-mono flex items-center gap-2 hover:border-lime-400 hover:text-lime-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    VER PAGINA PUBLICA
                  </Link>

                  {project?.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-neutral-600 px-6 py-3 text-neutral-400 font-brutal-mono flex items-center gap-2 hover:border-lime-400 hover:text-lime-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      ACESSAR DEPLOY
                    </a>
                  )}
                </div>
              </div>

              {/* Project details */}
              <div className="space-y-8">
                {/* URLs */}
                <div className="brutal-border bg-black p-6">
                  <h3 className="font-brutal-display text-lg text-lime-400 mb-4">URLS</h3>
                  <div className="space-y-3 font-brutal-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Deploy:</span>
                      <a
                        href={project?.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-lime-400"
                      >
                        {project?.project_url}
                      </a>
                    </div>
                    {project?.github_url && (
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">GitHub:</span>
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-lime-400"
                        >
                          {project.github_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team */}
                <div className="brutal-border bg-black p-6">
                  <h3 className="font-brutal-display text-lg text-lime-400 mb-4">EQUIPE</h3>
                  <div className="font-brutal-mono text-sm text-neutral-300">
                    {project?.is_solo ? 'Solo' : project?.team_members || 'Não especificado'}
                  </div>
                </div>

                {/* How it was built */}
                {project?.how_it_was_built && (
                  <div className="brutal-border bg-black p-6">
                    <h3 className="font-brutal-display text-lg text-lime-400 mb-4">
                      COMO FOI CONSTRUIDO
                    </h3>
                    <div className="font-brutal-mono text-sm text-neutral-300 whitespace-pre-wrap">
                      {project.how_it_was_built}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Edit mode */}
              <div className="mb-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 font-brutal-mono text-sm text-neutral-500 hover:text-lime-400 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  CANCELAR EDICAO
                </button>
              </div>

              <RegistrationForm
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                initialData={project || undefined}
                isSubmitting={isSubmitting}
              />
            </>
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
