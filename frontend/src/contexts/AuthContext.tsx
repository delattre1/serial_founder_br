import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialLoadComplete = false;

    console.log('[AUTH] Starting auth initialization...');

    // Get initial session - this is the source of truth for initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AUTH] getSession returned:', {
        hasSession: !!session,
        userId: session?.user?.id ?? 'null'
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      initialLoadComplete = true;
      console.log('[AUTH] Initial load complete, loading set to false');
    });

    // Listen for auth changes (sign in/out after initial load)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AUTH] onAuthStateChange:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id ?? 'null',
        initialLoadComplete
      });
      // Only update if initial load is complete, to avoid race condition
      // where this fires before getSession returns
      if (initialLoadComplete) {
        setSession(session);
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
