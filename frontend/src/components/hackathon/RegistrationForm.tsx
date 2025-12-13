import { useState, useRef } from 'react';
import { Upload, Loader2, X, Image } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface RegistrationFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onSaveDraft: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  isSubmitting?: boolean;
}

export interface ProjectFormData {
  name: string;
  short_description: string;
  full_description: string;
  project_url: string;
  github_url: string;
  how_it_was_built: string;
  is_solo: boolean;
  team_members: string;
  screenshot_url: string;
  social_handle: string;
}

export function RegistrationForm({
  onSubmit,
  onSaveDraft,
  initialData,
  isSubmitting = false,
}: RegistrationFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    project_url: initialData?.project_url || '',
    github_url: initialData?.github_url || '',
    how_it_was_built: initialData?.how_it_was_built || '',
    is_solo: initialData?.is_solo ?? true,
    team_members: initialData?.team_members || '',
    screenshot_url: initialData?.screenshot_url || '',
    social_handle: initialData?.social_handle || '',
  });

  const [charCount, setCharCount] = useState(formData.short_description.length);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'short_description') {
      setCharCount(value.length);
    }
  };

  const handleTeamToggle = (isSolo: boolean) => {
    setFormData((prev) => ({ ...prev, is_solo: isSolo }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDraft = () => {
    onSaveDraft(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione uma imagem.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Imagem muito grande. Máximo 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('hackathon-screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hackathon-screenshots')
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, screenshot_url: publicUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setFormData((prev) => ({ ...prev, screenshot_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
        // PASSO 2 DE 2
      </div>

      <h2 className="font-brutal-display text-4xl md:text-5xl text-white mb-8">
        REGISTRAR PROJETO
      </h2>

      {/* Project Name */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Nome do Projeto *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full brutal-input"
          placeholder="MeuSaaS"
        />
      </div>

      {/* Social Handle */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Seu @ <span className="text-neutral-600">(Twitter, Instagram, etc)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-brutal-mono">@</span>
          <input
            type="text"
            name="social_handle"
            value={formData.social_handle}
            onChange={handleChange}
            className="w-full brutal-input pl-8"
            placeholder="seuhandle"
          />
        </div>
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
          Sera exibido na pagina do projeto
        </p>
      </div>

      {/* Short Description */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Descricao Curta * <span className="text-neutral-600">({charCount}/160)</span>
        </label>
        <input
          type="text"
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          required
          maxLength={160}
          className="w-full brutal-input"
          placeholder="Um app que resolve X problema para Y pessoas"
        />
      </div>

      {/* Project URL */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          URL do Projeto * <span className="text-neutral-600">(deploy publico)</span>
        </label>
        <input
          type="url"
          name="project_url"
          value={formData.project_url}
          onChange={handleChange}
          required
          className="w-full brutal-input"
          placeholder="https://meusaas.com"
        />
      </div>

      {/* How it was built */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Como foi construido? <span className="text-neutral-600">(suporta markdown)</span>
        </label>
        <textarea
          name="how_it_was_built"
          value={formData.how_it_was_built}
          onChange={handleChange}
          className="w-full brutal-textarea"
          style={{ minHeight: '150px' }}
          placeholder={`### Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Supabase
- **IA**: Claude API

### Processo

Comecei definindo o problema...`}
        />
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
          Use ### para títulos, - para listas, **texto** para negrito
        </p>
      </div>

      {/* Full Description */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Descricao Completa <span className="text-neutral-600">(suporta markdown)</span>
        </label>
        <textarea
          name="full_description"
          value={formData.full_description}
          onChange={handleChange}
          className="w-full brutal-textarea"
          style={{ minHeight: '200px' }}
          placeholder={`## O que é o projeto?

Descreva seu projeto aqui...

### Funcionalidades

- **Feature 1**: Descrição da feature
- **Feature 2**: Outra feature legal
- **Feature 3**: Mais uma

### Como funciona?

1. Passo um
2. Passo dois
3. Passo três`}
        />
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
          Use ## para títulos grandes, ### para subtítulos, - para listas
        </p>
      </div>

      {/* GitHub URL */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          GitHub <span className="text-neutral-600">(opcional)</span>
        </label>
        <input
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          className="w-full brutal-input"
          placeholder="https://github.com/user/repo"
        />
      </div>

      {/* Team */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-4">
          Equipe
        </label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => handleTeamToggle(true)}
            className={`px-6 py-3 font-brutal-mono text-sm ${
              formData.is_solo
                ? 'bg-lime-400 text-black border-2 border-lime-400'
                : 'bg-transparent text-neutral-400 border-2 border-neutral-600'
            }`}
          >
            SOLO
          </button>
          <button
            type="button"
            onClick={() => handleTeamToggle(false)}
            className={`px-6 py-3 font-brutal-mono text-sm ${
              !formData.is_solo
                ? 'bg-lime-400 text-black border-2 border-lime-400'
                : 'bg-transparent text-neutral-400 border-2 border-neutral-600'
            }`}
          >
            EM EQUIPE
          </button>
        </div>
        {!formData.is_solo && (
          <input
            type="text"
            name="team_members"
            value={formData.team_members}
            onChange={handleChange}
            className="w-full brutal-input"
            placeholder="Joao, Maria, Pedro"
          />
        )}
      </div>

      {/* Screenshot Upload */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Screenshot/Imagem do Projeto
        </label>
        <div className="brutal-border bg-black p-6">
          {formData.screenshot_url ? (
            <div className="relative">
              <img
                src={formData.screenshot_url}
                alt="Screenshot preview"
                className="w-full aspect-video object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-8 text-center hover:bg-neutral-900 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-lime-400 mx-auto mb-4 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
              )}
              <p className="font-brutal-mono text-neutral-500 text-sm">
                {isUploading ? 'ENVIANDO...' : '[CLIQUE PARA UPLOAD]'}
              </p>
              <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
                PNG, JPG ou GIF - Max 5MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploadError && (
            <p className="font-brutal-mono text-red-500 text-sm mt-4 text-center">
              {uploadError}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-800">
            <p className="font-brutal-mono text-neutral-600 text-xs mb-2 text-center">
              Ou cole uma URL direta:
            </p>
            <input
              type="url"
              name="screenshot_url"
              value={formData.screenshot_url}
              onChange={handleChange}
              className="w-full brutal-input"
              placeholder="https://... (URL da imagem)"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-neutral-800">
        <button
          type="button"
          onClick={handleDraft}
          disabled={isSubmitting}
          className="brutal-border bg-black px-8 py-4 text-white font-brutal-mono hover-shift disabled:opacity-50"
        >
          [SALVAR RASCUNHO]
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-lime-400 text-black brutal-border-inverse px-8 py-4 font-brutal-mono hover-shift-dark flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              ENVIANDO...
            </>
          ) : (
            'SUBMETER PROJETO'
          )}
        </button>
      </div>
    </form>
  );
}
