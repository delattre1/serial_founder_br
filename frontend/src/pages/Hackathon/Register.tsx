import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PaymentChoice, RegistrationForm, ProjectFormData } from '@/components/hackathon';

type Step = 'payment' | 'form';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('payment');
  const [wantsToPay, setWantsToPay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingProject, setCheckingProject] = useState(true);

  // Check if user already has a project
  useEffect(() => {
    async function checkExistingProject() {
      if (!user) return;

      const { data: existingProject } = await supabase
        .from('hackathon_projects')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProject) {
        navigate('/hackathon/my-project', { replace: true });
      } else {
        setCheckingProject(false);
      }
    }

    if (!loading && user) {
      checkExistingProject();
    } else if (!loading && !user) {
      setCheckingProject(false);
    }
  }, [user, loading, navigate]);

  // Redirect to hackathon page if not authenticated
  if (!loading && !user) {
    return <Navigate to="/hackathon" replace />;
  }

  // Show loading while checking for existing project
  if (checkingProject) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-brutal-mono text-lime-400">// CARREGANDO...</div>
      </div>
    );
  }

  const handlePaymentChoice = (payOption: boolean) => {
    setWantsToPay(payOption);
    setStep('form');
  };

  const saveProject = async (data: ProjectFormData, isSubmitted: boolean) => {
    if (!user) return null;

    const slug = generateSlug(data.name) + '-' + Date.now().toString(36);

    const projectData = {
      user_id: user.id,
      name: data.name,
      slug,
      short_description: data.short_description,
      full_description: data.full_description || null,
      how_it_was_built: data.how_it_was_built || null,
      project_url: data.project_url,
      github_url: data.github_url || null,
      screenshot_url: data.screenshot_url || null,
      team_members: data.is_solo ? [] : data.team_members.split(',').map((m) => m.trim()),
      is_solo: data.is_solo,
      paid_entry: wantsToPay,
      is_submitted: isSubmitted,
      submitted_at: isSubmitted ? new Date().toISOString() : null,
      social_handle: data.social_handle || null,
    };

    const { data: project, error } = await supabase
      .from('hackathon_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('Error saving project:', error);
      throw error;
    }

    return project;
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      await saveProject(data, true);
      navigate('/hackathon/my-project');
    } catch (error) {
      alert('Erro ao salvar projeto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (data: ProjectFormData) => {
    try {
      await saveProject(data, false);
      alert('Rascunho salvo!');
      navigate('/hackathon/my-project');
    } catch (error) {
      alert('Erro ao salvar rascunho. Tente novamente.');
    }
  };

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
      <main className="py-16 px-4">
        {step === 'payment' && <PaymentChoice onSelect={handlePaymentChoice} />}

        {step === 'form' && (
          <div>
            {/* Back to payment choice */}
            <div className="max-w-2xl mx-auto mb-8">
              <button
                onClick={() => setStep('payment')}
                className="flex items-center gap-2 font-brutal-mono text-sm text-neutral-500 hover:text-lime-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                VOLTAR PARA ESCOLHA
              </button>

              {/* Payment status indicator */}
              <div className="mt-4 p-4 border-2 border-neutral-800">
                <div className="font-brutal-mono text-xs text-neutral-600">
                  // MODO SELECIONADO:
                </div>
                <div className={`font-brutal-mono text-sm ${wantsToPay ? 'text-lime-400' : 'text-neutral-400'}`}>
                  {wantsToPay ? 'R$20 - COM PREMIACAO' : 'GRATIS - SEM PREMIACAO'}
                </div>
              </div>
            </div>

            <RegistrationForm
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </main>

      {/* Large watermark decoration */}
      <div className="fixed bottom-0 right-0 text-neutral-900 text-[15rem] md:text-[20rem] font-brutal-display opacity-20 pointer-events-none select-none leading-none">
        SF
      </div>
    </div>
  );
}
