
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Simple subscription data (we'll make this database-driven later)
const SUBSCRIPTION_PLANS = [
  {
    id: 'freemium',
    name: 'Freemium Foundation',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '5 AI conversations per month',
      'Basic mood tracking',
      '1 psychological assessment per month',
      'Community access (read-only)',
      'Educational resources'
    ],
    aiConversationsLimit: 5,
    professionalSessionsLimit: 0,
    hasVoiceTherapy: false,
    hasCommunityAccess: true,
    communityReadOnly: true,
    psychologicalAssessmentsLimit: 1,
  },
  {
    id: 'essential',
    name: 'Essential Plan',
    monthlyPrice: 499,
    annualPrice: 324,
    features: [
      'Unlimited AI conversations',
      '1 professional session per month',
      'Complete assessment suite',
      'Full community features',
      'Voice therapy access'
    ],
    aiConversationsLimit: null,
    professionalSessionsLimit: 1,
    hasVoiceTherapy: true,
    hasCommunityAccess: true,
    communityReadOnly: false,
    psychologicalAssessmentsLimit: null,
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    monthlyPrice: 899,
    annualPrice: 584,
    features: [
      '2 professional sessions per month',
      'Priority AI support',
      'Advanced analytics',
      'Group therapy access',
      'Email support'
    ],
    aiConversationsLimit: null,
    professionalSessionsLimit: 2,
    hasVoiceTherapy: true,
    hasCommunityAccess: true,
    communityReadOnly: false,
    psychologicalAssessmentsLimit: null,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    monthlyPrice: 1499,
    annualPrice: 974,
    features: [
      '4 professional sessions per month',
      'Dedicated therapist matching',
      'Crisis support access',
      'Phone support',
      'Custom wellness plans'
    ],
    aiConversationsLimit: null,
    professionalSessionsLimit: 4,
    hasVoiceTherapy: true,
    hasCommunityAccess: true,
    communityReadOnly: false,
    psychologicalAssessmentsLimit: null,
  },
];

const SESSION_PRICING = [
  { id: 'standard', type: 'Standard Session', duration: 45, price: 799, description: 'Individual therapy session with certified professionals' },
  { id: 'extended', type: 'Extended Session', duration: 60, price: 1099, description: 'Extended therapy session for deeper exploration' },
  { id: 'group', type: 'Group Session', price: 399, description: 'Therapeutic group sessions with shared experiences' },
  { id: 'crisis', type: 'Crisis Support Session', price: 1299, description: 'Emergency mental health support when you need it most' },
];

export const useSimpleSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentUsage, setCurrentUsage] = useState({
    aiConversations: 0,
    professionalSessions: 0,
    psychologicalAssessments: 0,
  });

  // For demo purposes, assume user is on freemium plan
  const currentPlan = SUBSCRIPTION_PLANS[0]; // Freemium plan

  const hasReachedLimit = (type: 'aiConversations' | 'professionalSessions' | 'psychologicalAssessments'): boolean => {
    const limitMap = {
      aiConversations: currentPlan.aiConversationsLimit,
      professionalSessions: currentPlan.professionalSessionsLimit,
      psychologicalAssessments: currentPlan.psychologicalAssessmentsLimit,
    };

    const usageMap = {
      aiConversations: currentUsage.aiConversations,
      professionalSessions: currentUsage.professionalSessions,
      psychologicalAssessments: currentUsage.psychologicalAssessments,
    };

    const limit = limitMap[type];
    const used = usageMap[type];

    // If limit is null, it means unlimited
    if (limit === null) return false;
    
    return used >= limit;
  };

  const canAccessFeature = (feature: string): boolean => {
    // Simple feature access logic
    switch (feature) {
      case 'voice_therapy':
        return currentPlan.hasVoiceTherapy;
      case 'community_access':
        return currentPlan.hasCommunityAccess;
      case 'community_write':
        return currentPlan.hasCommunityAccess && !currentPlan.communityReadOnly;
      default:
        return true;
    }
  };

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

  const incrementUsage = (type: 'aiConversations' | 'professionalSessions' | 'psychologicalAssessments') => {
    setCurrentUsage(prev => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return {
    plans: SUBSCRIPTION_PLANS,
    sessionPricing: SESSION_PRICING,
    currentPlan,
    currentUsage,
    hasReachedLimit,
    canAccessFeature,
    subscribeToPlan,
    incrementUsage,
    isLoading: false,
  };
};
