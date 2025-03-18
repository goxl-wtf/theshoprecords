'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { User } from '@supabase/supabase-js';
import supabase, { getSupabase } from '@/utils/supabase';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const initializeUser = async () => {
      try {
        const supabaseClient = getSupabase();
        if (!supabaseClient) {
          throw new Error('Supabase client not initialized');
        }
        
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user || null);
        
        // Listen for auth changes
        const { data: { subscription } } = await supabaseClient.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user || null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize user'));
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const supabaseClient = getSupabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Sign in error:', err);
      const error = err instanceof Error ? err : new Error('Failed to sign in');
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const supabaseClient = getSupabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      
      await supabaseClient.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 