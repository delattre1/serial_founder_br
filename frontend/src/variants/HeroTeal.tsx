import Hero from "@/components/ui/animated-shader-hero";

const HeroTeal: React.FC = () => {
  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked - Teal');
  };

  const scrollToDetails = () => {
    console.log('Scroll to details clicked - Teal');
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
      shaderPalette="teal"
    />
  );
};

export default HeroTeal;
