import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Header1 } from "@/components/ui/header";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header1 user={user} onSignOut={handleSignOut} />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 3D Robot Scene */}
          <div className="w-full h-[500px] relative overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left content */}
              <div className="flex-1 p-8 pb-0 md:pb-8 relative z-10 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Bem-vindo à Comunidade
                </h1>
                <p className="mt-4 text-neutral-300 max-w-lg">
                  Você agora faz parte da Serial Founders Brasil.<br />
                  Transforme suas ideias em produtos reais e junte-se a outros desenvolvedores que estão construindo o futuro.
                </p>
              </div>

              {/* Right content - 3D Robot */}
              <div className="flex-1 relative">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
