import Hero from "@/components/ui/animated-shader-hero";
import { supabase } from "@/lib/supabase";

function App() {
  const handleGoogleSignIn = async () => {
    try {
      console.log('Google Sign In clicked');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
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

  const scrollToDetails = () => {
    console.log('Scroll to details clicked');
    // Add scroll logic here
  };

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
        },
        secondary: {
          text: "Ver Como Funciona",
          onClick: scrollToDetails
        }
      }}
      shaderPalette="blue"
    />
  );
}

export default App;
