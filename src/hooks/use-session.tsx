
"use client";

import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Session {
  user: User | null;
  loading: boolean;
}

interface UpdateData {
    displayName?: string;
}

interface SessionActions {
    updateUserProfile: (data: UpdateData) => Promise<void>;
}

const SessionContext = createContext<Session | undefined>(undefined);
const SessionActionsContext = createContext<SessionActions | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, loading: true });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession({ user, loading: false });
    });
    return () => unsubscribe();
  }, []);
  
  const updateUserProfile = useCallback(async (data: UpdateData) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
       throw new Error("No user is signed in to update profile.");
    }
    await updateProfile(currentUser, data);
    // After updating firebase, we need to update our local state
    setSession(prev => {
        const updatedUser = prev.user ? { ...prev.user, ...data } : null;
        if(updatedUser) {
           return { ...prev, user: updatedUser as User };
        }
        return prev;
    });
  }, []);


  useEffect(() => {
    if (!session.loading) {
      const isPublicRoute = ['/login', '/signup', '/'].includes(pathname);
      if (session.user && isPublicRoute) {
        router.push('/dashboard');
      } else if (!session.user && !isPublicRoute) {
        router.push('/login');
      }
    }
  }, [session.loading, session.user, pathname, router]);

  if (session.loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const isPublicRoute = ['/login', '/signup', '/'].includes(pathname);
  if (session.user || isPublicRoute) {
    return (
      <SessionContext.Provider value={session}>
        <SessionActionsContext.Provider value={{ updateUserProfile }}>
            {children}
        </SessionActionsContext.Provider>
      </SessionContext.Provider>
    );
  }

  return null;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export function useSessionActions() {
    const context = useContext(SessionActionsContext);
    if (context === undefined) {
        throw new Error('useSessionActions must be used within a SessionProvider');
    }
    return context;
}
