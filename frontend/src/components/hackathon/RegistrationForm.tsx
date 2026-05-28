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
  screenshot_url: string;
  social_handle: string;
  demo_video_url: string; // public link (Loom/YouTube/Drive/etc.) to a demo video
  entry_shared: boolean;
  entry_proof_url: string; // Supabase Storage URL of the repost screenshot
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const isValidUrl = (value: string) => /^https?:\/\/.+/i.test(value.trim());

export function RegistrationForm({
  onSubmit,
  onSaveDraft,
  initialData,
  isSubmitting = false,
}: RegistrationFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    project_url: initialData?.project_url || '',
    github_url: initialData?.github_url || '',
    how_it_was_built: initialData?.how_it_was_built || '',
    screenshot_url: initialData?.screenshot_url || '',
    social_handle: initialData?.social_handle || '',
    demo_video_url: initialData?.demo_video_url || '',
    entry_shared: initialData?.entry_shared ?? false,
    entry_proof_url: initialData?.entry_proof_url || '',
  });

  const [charCount, setCharCount] = useState(formData.short_description.length);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(formData.demo_video_url)) {
      setVideoError('Adicione o link do video do produto funcionando (URL publica e acessivel).');
      return;
    }
    setVideoError(null);

    if (!formData.entry_shared) {
      setEntryError('Voce precisa repostar o video (marcando @danedelattre) e confirmar a caixa para submeter.');
      return;
    }
    if (!formData.entry_proof_url) {
      setEntryError('Envie o print do seu repost para submeter (o premio so e pago apos confirmacao).');
      return;
    }

    setEntryError(null);
    onSubmit(formData);
  };

  const handleDraft = () => {
    onSaveDraft(formData);
  };

  // Uploads an image to the hackathon-screenshots bucket, returns the public URL.
  const uploadImage = async (file: File, maxMB: number): Promise<string> => {
    if (!user) throw new Error('Faca login para enviar a imagem.');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Formato invalido. Use PNG, JPG ou WEBP.');
    }
    if (file.size > maxMB * 1024 * 1024) {
      throw new Error(`Imagem muito grande. Maximo ${maxMB}MB.`);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage.from('hackathon-screenshots').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('hackathon-screenshots').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file, 5);
      setFormData((prev) => ({ ...prev, screenshot_url: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro ao fazer upload. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProof(true);
    setProofError(null);
    setEntryError(null);
    try {
      const url = await uploadImage(file, 10);
      setFormData((prev) => ({ ...prev, entry_proof_url: url }));
    } catch (err) {
      setProofError(err instanceof Error ? err.message : 'Erro ao fazer upload. Tente novamente.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setFormData((prev) => ({ ...prev, screenshot_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveProof = () => {
    setFormData((prev) => ({ ...prev, entry_proof_url: '' }));
    if (proofInputRef.current) proofInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="text-lime-400 text-xs tracking-widest font-brutal-mono mb-4">
        // INSCRICAO
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

      {/* Project / repo URL (optional — no public deploy required) */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Link do projeto / repo <span className="text-neutral-600">(opcional)</span>
        </label>
        <input
          type="url"
          name="project_url"
          value={formData.project_url}
          onChange={handleChange}
          className="w-full brutal-input"
          placeholder="https://github.com/user/seed-repo"
        />
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
          Deploy publico NAO e obrigatorio. Pode ser o repo com a sua SEED (.md).
        </p>
      </div>

      {/* Demo video — REQUIRED public link */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Video do produto funcionando * <span className="text-neutral-600">(Loom, YouTube, Drive, etc.)</span>
        </label>
        <input
          type="url"
          name="demo_video_url"
          value={formData.demo_video_url}
          onChange={(e) => {
            setVideoError(null);
            handleChange(e);
          }}
          className="w-full brutal-input"
          placeholder="https://loom.com/share/..."
        />
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">
          O link PRECISA estar publico e acessivel. Se nao abrir, a submissao e desqualificada.
        </p>
        {videoError && <p className="font-brutal-mono text-red-500 text-sm mt-2">{videoError}</p>}
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

Descreva seu projeto aqui...`}
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

      {/* Screenshot Upload */}
      <div>
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          Screenshot/Imagem do Projeto
        </label>
        <div className="brutal-border bg-black p-6">
          {formData.screenshot_url ? (
            <div className="relative">
              <img src={formData.screenshot_url} alt="Screenshot preview" className="w-full aspect-video object-cover" />
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
              <p className="font-brutal-mono text-neutral-600 text-xs mt-2">PNG, JPG ou WEBP - Max 5MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleScreenshotUpload} className="hidden" />
          {uploadError && <p className="font-brutal-mono text-red-500 text-sm mt-4 text-center">{uploadError}</p>}
        </div>
      </div>

      {/* Entry = repost the announcement video (with screenshot proof) */}
      <div className="brutal-border-lime bg-black p-6">
        <div className="flex items-start gap-3 mb-4">
          <Share2 className="w-6 h-6 text-lime-400 flex-shrink-0" />
          <div>
            <h3 className="font-brutal-display text-xl text-white">{CURRENT.entry.headline}</h3>
            <p className="font-brutal-mono text-xs text-neutral-400 mt-1">{CURRENT.entry.description}</p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-4">
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
          <span className="font-brutal-mono text-sm text-neutral-200">{CURRENT.entry.checkboxLabel} *</span>
        </label>

        {/* Repost screenshot proof upload */}
        <label className="block font-brutal-mono text-sm text-neutral-400 mb-2">
          {CURRENT.entry.proofLabel}
        </label>
        <div className="border-2 border-neutral-700 bg-black p-4">
          {formData.entry_proof_url ? (
            <div className="relative">
              <img src={formData.entry_proof_url} alt="Print do repost" className="w-full max-h-72 object-contain" />
              <button
                type="button"
                onClick={handleRemoveProof}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => proofInputRef.current?.click()}
              className="cursor-pointer p-6 text-center hover:bg-neutral-900 transition-colors"
            >
              {isUploadingProof ? (
                <Loader2 className="w-8 h-8 text-lime-400 mx-auto mb-3 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              )}
              <p className="font-brutal-mono text-neutral-500 text-sm">
                {isUploadingProof ? 'ENVIANDO...' : '[ENVIAR PRINT DO REPOST]'}
              </p>
              <p className="font-brutal-mono text-neutral-600 text-xs mt-2">PNG, JPG ou WEBP - Max 10MB</p>
            </div>
          )}
          <input ref={proofInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProofUpload} className="hidden" />
          {proofError && <p className="font-brutal-mono text-red-500 text-sm mt-3 text-center">{proofError}</p>}
        </div>
        <p className="font-brutal-mono text-neutral-600 text-xs mt-2">{CURRENT.entry.proofHint}</p>

        {entryError && <p className="font-brutal-mono text-red-500 text-sm mt-4">{entryError}</p>}
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
