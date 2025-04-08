
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;      // Added id property
  name: string;
  email: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  loginWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('chetna_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // Ensure user has an id
    if (!userData.id) {
      // Generate a random ID if none exists (this is a temporary solution)
      // In a real app with Supabase, this would be the auth.user.id
      userData.id = crypto.randomUUID();
    }
    
    setUser(userData);
    localStorage.setItem('chetna_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chetna_user');
  };

  const loginWithGoogle = () => {
    // This is a mock function - in a real app, this would integrate with Google OAuth
    // For now, we'll just simulate a successful login
    setTimeout(() => {
      const mockGoogleUser = {
        id: crypto.randomUUID(), // Generate a random UUID for demo purposes
        name: 'Google User',
        email: 'user@example.com',
        photoURL: 'https://via.placeholder.com/40'
      };
      login(mockGoogleUser);
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, loginWithGoogle }}>
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
