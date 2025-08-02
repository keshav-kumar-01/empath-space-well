
import React from 'react';
import { useSubscription, UserSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: keyof UserSubscription;
  usageType?: 'ai_conversations' | 'professional_sessions' | 'psychological_assessments';
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  feature,
  usageType,
  fallbackTitle,
  fallbackDescription,
}) => {
  const { userSubscription, canAccessFeature, hasReachedLimit, getRemainingUsage } = useSubscription();
  const navigate = useNavigate();

  // If checking feature access
  if (feature && !canAccessFeature(feature)) {
    return (
      <Card className="border-chetna-primary/20 bg-gradient-to-br from-chetna-light/50 to-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-chetna-primary/10 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-chetna-primary" />
          </div>
          <CardTitle className="text-chetna-dark">
            {fallbackTitle || 'Premium Feature'}
          </CardTitle>
          <CardDescription>
            {fallbackDescription || 'This feature requires a paid subscription to access.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate('/pricing')}
            className="bg-chetna-primary hover:bg-chetna-primary/90 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If checking usage limits
  if (usageType && hasReachedLimit(usageType)) {
    const remaining = getRemainingUsage(usageType);
    const usageLabels = {
      ai_conversations: 'AI Conversations',
      professional_sessions: 'Professional Sessions',
      psychological_assessments: 'Psychological Assessments'
    };

    return (
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-chetna-dark">
            {fallbackTitle || 'Usage Limit Reached'}
          </CardTitle>
          <CardDescription>
            {fallbackDescription || `You've reached your monthly limit for ${usageLabels[usageType]}.`}
          </CardDescription>
          {remaining !== null && (
            <p className="text-sm text-orange-600 mt-2">
              {remaining} remaining this month
            </p>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <Button 
            onClick={() => navigate('/pricing')}
            className="bg-chetna-primary hover:bg-chetna-primary/90 text-white w-full"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade for More Access
          </Button>
          <p className="text-xs text-gray-600">
            Limits reset monthly. Current plan: {userSubscription?.plan_name || 'Free'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
