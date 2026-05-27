import { useState, useRef } from 'react';
import { Upload, Loader2, X, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CURRENT } from '@/config/hackathon';

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
  entry_shared: boolean;
  entry_proof_url: string;
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
    entry_shared: initialData?.entry_shared ?? false,
    entry_proof_url: initialData?.entry_proof_url || '',
  });

  const [charCount, setCharCount] = useState(formData.short_description.length);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);

  const isValidUrl = (value: string) => /^https?:\/\/.+/i.test(value.trim());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Strip leading @ from social handle
    const cleanValue = name === 'social_handle' ? value.replace(/^@+/, '') : value;

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    if (name === 'short_description') {
      setCharCount(value.length);
    }
  };

  const handleTeamToggle = (isSolo: boolean) => {
    setFormData((prev) => ({ ...prev, is_solo: isSolo }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.entry_shared) {
      setEntryError('Voce precisa repostar o video de anuncio e marcar a caixa para submeter.');
      return;
    }
    if (formData.entry_proof_url.trim() && !isValidUrl(formData.entry_proof_url)) {
      setEntryError('O link do repost precisa ser uma URL valida (https://...).');
      return;
    }

    setEntryError(null);
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
        <input
          type="text"
          name="social_handle"
          value={formData.social_handle}
          onChange={handleChange}
          className="w-full brutal-input"
          placeholder="@seuhandle"
        />
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

      {/* Entry = repost the announcement video */}
      <div className="brutal-border-lime bg-black p-6">
        <div className="flex items-start gap-3 mb-4">
          <Share2 className="w-6 h-6 text-lime-400 flex-shrink-0" />
          <div>
            <h3 className="font-brutal-display text-xl text-white">{CURRENT.entry.headline}</h3>
            <p className="font-brutal-mono text-xs text-neutral-400 mt-1">
              {CURRENT.entry.description}
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="entry_shared"
            checked={formData.entry_shared}
            onChange={(e) => {
              setEntryError(null);
              setFormData((prev) => ({ ...prev, entry_shared: e.target.checked }));
            }}
            className="mt-1 w-5 h-5 accent-lime-400 flex-shrink-0"
          />
          <span className="font-brutal-mono text-sm text-neutral-200">
            {CURRENT.entry.checkboxLabel} *
          </span>
        </label>

        <div className="mt-4">
          <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
            {CURRENT.entry.proofLabel}
          </label>
          <input
            type="url"
            name="entry_proof_url"
            value={formData.entry_proof_url}
            onChange={handleChange}
            className="w-full brutal-input"
            placeholder="https://instagram.com/..."
          />
          <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
            {CURRENT.entry.proofHint}
          </p>
        </div>

        {entryError && (
          <p className="font-brutal-mono text-red-500 text-sm mt-4">{entryError}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-8 border-t-2 border-neutral-800 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="brutal-border bg-black px-8 py-4 text-white font-brutal-mono hover-shift disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              ENVIANDO...
            </>
          ) : (
            '[SUBMETER PROJETO]'
          )}
        </button>

        <button
          type="button"
          onClick={handleDraft}
          disabled={isSubmitting}
          className="border-2 border-neutral-600 px-8 py-4 text-neutral-400 font-brutal-mono hover:border-lime-400 hover:text-lime-400 transition-colors disabled:opacity-50"
        >
          [SALVAR RASCUNHO]
        </button>
      </div>
    </form>
  );
}
