
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{error: any | null}>;
  signup: (email: string, password: string, userData: {name: string}) => Promise<{error: any | null}>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (userData: {name?: string; photoURL?: string}) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Check if user is a therapist
          const { data: therapistData } = await supabase.rpc('get_therapist_by_user_id', {
            _user_id: currentSession.user.id
          });

          // Format user data from Supabase session
          const userData: User = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
            email: currentSession.user.email || '',
            photoURL: currentSession.user.user_metadata?.avatar_url,
          };
          setUser(userData);

          // Redirect therapists to their dashboard
          if (therapistData && therapistData.length > 0) {
            // Use timeout to ensure component mounting is complete
            setTimeout(() => {
              window.location.href = '/therapist-dashboard';
            }, 100);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession);
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Check if user is a therapist
        const { data: therapistData } = await supabase.rpc('get_therapist_by_user_id', {
          _user_id: currentSession.user.id
        });

        const userData: User = {
          id: currentSession.user.id,
          name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
          email: currentSession.user.email || '',
          photoURL: currentSession.user.user_metadata?.avatar_url,
        };
        setUser(userData);

        // Redirect therapists to their dashboard on initial load
        if (therapistData && therapistData.length > 0 && window.location.pathname === '/') {
          window.location.href = '/therapist-dashboard';
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Logging in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      console.log('Login successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: {name: string}) => {
    try {
      console.log('Signing up with email:', email);
      
      // Get the current origin for redirect
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      console.log('Signup successful:', data);
      
      // Show success message
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error };
    }
  };

  const logout = async () => {
    console.log('Logging out');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Initiating Google login');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Unexpected Google login error:', error);
    }
  };

  const updateProfile = async (userData: {name?: string; photoURL?: string}) => {
    try {
      console.log('Updating profile:', userData);
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          avatar_url: userData.photoURL,
        },
      });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      // Update local user state
      if (user) {
        setUser({
          ...user,
          name: userData.name || user.name,
          photoURL: userData.photoURL || user.photoURL,
        });
      }

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Unexpected profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout, loginWithGoogle, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
