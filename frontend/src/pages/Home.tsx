import Hero from "@/components/ui/animated-shader-hero";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Google Sign In clicked');
      console.log('Current origin:', window.location.origin);
      console.log('Current href:', window.location.href);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: false,
          redirectTo: window.location.origin + '/',
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Erro ao fazer login com Google. Tente novamente.');
      }

      // The user will be redirected to Google for authentication
      // After successful authentication, they'll be redirected back to your app
      console.log('Redirecting to Google...', data);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Erro inesperado. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Hero
      trustBadge={{
        text: "Mais de 1 dev brasileiro já lançou seu produto",
        icons: ["🚀"]
      }}
      headline={{
        line1: "Pare de Planejar.",
        line2: "Comece a Construir."
      }}
      subtitle="Tire seu produto do papel e coloque no ar — mesmo trabalhando 8h no CLT.|Serial Founders Brasil é a comunidade que transforma devs em founders.|Do zero ao lançamento em 30 dias."
      buttons={{
        primary: {
          text: "Entrar na Comunidade (Grátis)",
          onClick: handleGoogleSignIn
        }
      }}
      shaderPalette="blue"
    />
  );
}
