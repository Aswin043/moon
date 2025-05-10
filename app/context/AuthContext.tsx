"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Cookies from 'js-cookie';

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

  useEffect(() => {
    // Check for cookie consent
    const hasAcceptedCookies = localStorage.getItem('cookieConsent') === 'true';
    
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
        // Fetch user name from user table
        const { data, error } = await supabase
          .from('user')
          .select('name')
          .eq('id', session.user.id)
          .single();
        setUserName(data?.name || null);
      } else {
        setUserName(null);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && hasAcceptedCookies) {
        // Set auth cookie
        Cookies.set('auth_token', session.access_token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        // Remove auth cookie on sign out
        Cookies.remove('auth_token');
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user name from user table
        const { data, error } = await supabase
          .from('user')
          .select('name')
          .eq('id', session.user.id)
          .single();
        setUserName(data?.name || null);
      } else {
        setUserName(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userName, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}; 