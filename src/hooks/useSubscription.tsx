
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
  ai_conversations_limit: number | null;
  professional_sessions_limit: number;
  has_voice_therapy: boolean;
  has_community_access: boolean;
  community_read_only: boolean;
  has_priority_support: boolean;
  has_crisis_support: boolean;
  has_phone_support: boolean;
  has_email_support: boolean;
  has_advanced_analytics: boolean;
  has_group_therapy: boolean;
  has_dedicated_therapist_matching: boolean;
  has_custom_wellness_plans: boolean;
  psychological_assessments_limit: number | null;
}

export interface UserSubscription {
  plan_name: string;
  is_annual: boolean;
  status: string;
  expires_at: string | null;
  ai_conversations_limit: number | null;
  professional_sessions_limit: number;
  has_voice_therapy: boolean;
  has_community_access: boolean;
  community_read_only: boolean;
  has_priority_support: boolean;
  has_crisis_support: boolean;
  has_phone_support: boolean;
  has_email_support: boolean;
  has_advanced_analytics: boolean;
  has_group_therapy: boolean;
  has_dedicated_therapist_matching: boolean;
  has_custom_wellness_plans: boolean;
  psychological_assessments_limit: number | null;
}

export interface UserUsage {
  ai_conversations_used: number;
  professional_sessions_used: number;
  psychological_assessments_used: number;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all available subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price');
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  // Fetch user's current subscription
  const { data: userSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_id: user.id });
      
      if (error) throw error;
      return data?.[0] as UserSubscription | null;
    },
    enabled: !!user?.id,
  });

  // Fetch user's current usage
  const { data: userUsage, isLoading: usageLoading } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_usage', { user_id: user.id });
      
      if (error) throw error;
      return data?.[0] as UserUsage | null;
    },
    enabled: !!user?.id,
  });

  // Update usage mutation
  const updateUsageMutation = useMutation({
    mutationFn: async ({ type }: { type: 'ai_conversations' | 'professional_sessions' | 'psychological_assessments' }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // First, try to get existing usage record
      const { data: existingUsage } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('current_month', currentMonth)
        .eq('current_year', currentYear)
        .single();

      if (existingUsage) {
        // Update existing record
        const updateField = `${type}_used`;
        const { error } = await supabase
          .from('user_usage')
          .update({
            [updateField]: existingUsage[updateField] + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUsage.id);

        if (error) throw error;
      } else {
        // Create new record
        const newUsage = {
          user_id: user.id,
          current_month: currentMonth,
          current_year: currentYear,
          ai_conversations_used: type === 'ai_conversations' ? 1 : 0,
          professional_sessions_used: type === 'professional_sessions' ? 1 : 0,
          psychological_assessments_used: type === 'psychological_assessments' ? 1 : 0,
        };

        const { error } = await supabase
          .from('user_usage')
          .insert(newUsage);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-usage', user?.id] });
    },
  });

  // Check if user can access a feature
  const canAccessFeature = (featureName: keyof UserSubscription): boolean => {
    if (!userSubscription) return false;
    return userSubscription[featureName] as boolean;
  };

  // Check if user has reached usage limit
  const hasReachedLimit = (type: 'ai_conversations' | 'professional_sessions' | 'psychological_assessments'): boolean => {
    if (!userSubscription || !userUsage) return false;

    const limitField = `${type}_limit` as keyof UserSubscription;
    const usedField = `${type}_used` as keyof UserUsage;
    
    const limit = userSubscription[limitField] as number | null;
    const used = userUsage[usedField] as number;

    // If limit is null, it means unlimited
    if (limit === null) return false;
    
    return used >= limit;
  };

  // Get remaining usage for a type
  const getRemainingUsage = (type: 'ai_conversations' | 'professional_sessions' | 'psychological_assessments'): number | null => {
    if (!userSubscription || !userUsage) return null;

    const limitField = `${type}_limit` as keyof UserSubscription;
    const usedField = `${type}_used` as keyof UserUsage;
    
    const limit = userSubscription[limitField] as number | null;
    const used = userUsage[usedField] as number;

    // If limit is null, it means unlimited
    if (limit === null) return null;
    
    return Math.max(0, limit - used);
  };

  // Subscribe to a plan (this would integrate with Stripe)
  const subscribeToPlan = async (planId: string, isAnnual: boolean = false) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    // For now, just show a message - in production this would integrate with Stripe
    toast({
      title: "Subscription Required",
      description: "This feature would integrate with Stripe for payment processing.",
    });
  };

  return {
    plans,
    userSubscription,
    userUsage,
    isLoading: plansLoading || subscriptionLoading || usageLoading,
    canAccessFeature,
    hasReachedLimit,
    getRemainingUsage,
    updateUsage: updateUsageMutation.mutate,
    subscribeToPlan,
  };
};
