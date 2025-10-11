import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

type TherapistData = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  specialties: string[];
  languages: string[];
  experience: string;
  fee: string;
  rating: number;
  total_reviews: number;
  avatar_url?: string;
  available: boolean;
};

type TherapistAuthContextType = {
  therapist: TherapistData | null;
  session: Session | null;
  isLoading: boolean;
  isTherapist: boolean;
  checkTherapistStatus: () => Promise<boolean>;
  updateTherapistProfile: (data: Partial<TherapistData>) => Promise<void>;
};

const TherapistAuthContext = createContext<TherapistAuthContextType | undefined>(undefined);

export const TherapistAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [therapist, setTherapist] = useState<TherapistData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTherapist, setIsTherapist] = useState<boolean>(false);
  const { toast } = useToast();

  const checkTherapistStatus = async (): Promise<boolean> => {
    if (!session?.user) return false;

    try {
      const { data, error } = await supabase.rpc('get_therapist_by_user_id', {
        _user_id: session.user.id
      });

      if (error) {
        return false;
      }

      if (data && data.length > 0) {
        const therapistData = data[0];
        setTherapist(therapistData);
        setIsTherapist(true);
        return true;
      }

      setIsTherapist(false);
      return false;
    } catch (error) {
      return false;
    }
  };

  const updateTherapistProfile = async (updateData: Partial<TherapistData>) => {
    if (!therapist) throw new Error('No therapist data available');

    try {
      const { error } = await supabase
        .from('therapists')
        .update(updateData)
        .eq('id', therapist.id);

      if (error) throw error;

      // Update local state
      setTherapist(prev => prev ? { ...prev, ...updateData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your therapist profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            try {
              await checkTherapistStatus();
            } catch (error) {
              // Silent error handling
            }
          }, 0);
        } else {
          setTherapist(null);
          setIsTherapist(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        await checkTherapistStatus();
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Re-check therapist status when session changes
  useEffect(() => {
    if (session?.user) {
      checkTherapistStatus();
    }
  }, [session]);

  return (
    <TherapistAuthContext.Provider value={{ 
      therapist, 
      session, 
      isLoading, 
      isTherapist,
      checkTherapistStatus,
      updateTherapistProfile
    }}>
      {children}
    </TherapistAuthContext.Provider>
  );
};

export const useTherapistAuth = () => {
  const context = useContext(TherapistAuthContext);
  if (context === undefined) {
    throw new Error('useTherapistAuth must be used within a TherapistAuthProvider');
  }
  return context;
};