"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  userName: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userName: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for cookie consent
    const hasAcceptedCookies = localStorage.getItem('cookieConsent') === 'true';
    
    // Helper to upsert user and fetch name
    const upsertAndFetchUserName = async (sessionUser: User) => {
      try {
        const name = sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User';
        // Upsert user into user table
        const { error: upsertError } = await supabase.from('user').upsert({
          id: sessionUser.id,
          email: sessionUser.email,
          name,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        if (upsertError) throw upsertError;

        // Fetch user name from user table
        const { data, error } = await supabase
          .from('user')
          .select('name')
          .eq('id', sessionUser.id)
          .single();

        if (error) throw error;
        setUserName(data?.name || name);
      } catch (error) {
        console.error('Error updating user:', error);
        // Fallback to email username if database operations fail
        setUserName(sessionUser.email?.split('@')[0] || 'User');
      }
    };

    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && hasAcceptedCookies) {
        // Set auth cookie
        Cookies.set('auth_token', session.access_token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        await upsertAndFetchUserName(session.user);
      } else {
        setUserName(null);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Remove auth cookie on sign out
        Cookies.remove('auth_token');
        setUser(null);
        setUserName(null);
        router.push('/login');
      } else if (session?.user) {
        if (hasAcceptedCookies) {
          // Set auth cookie
          Cookies.set('auth_token', session.access_token, { 
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
        }
        setUser(session.user);
        await upsertAndFetchUserName(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, userName, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}; 