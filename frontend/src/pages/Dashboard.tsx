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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header1 />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 3D Robot Scene */}
          <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
            <div className="flex h-full">
              {/* Left content */}
              <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Bem-vindo à Comunidade
                </h1>
                <p className="mt-4 text-neutral-300 max-w-lg">
                  Você agora faz parte da Serial Founders Brasil. Transforme suas ideias em produtos reais
                  e junte-se a outros desenvolvedores que estão construindo o futuro.
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
          </Card>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user.user_metadata?.full_name || 'Founder'}! 🚀
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações da Conta
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'Não informado'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Provedor:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {user.app_metadata?.provider || 'Email'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Membro desde:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
