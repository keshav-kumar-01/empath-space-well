
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, MessageCircle, Users, Brain, Infinity } from 'lucide-react';
import { useSimpleSubscription } from '@/hooks/useSimpleSubscription';
import { useNavigate } from 'react-router-dom';

const SimpleUsageDashboard: React.FC = () => {
  const { currentPlan, currentUsage } = useSimpleSubscription();
  const navigate = useNavigate();

  if (!currentPlan) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading subscription details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUsagePercentage = (used: number, limit: number | null): number => {
    if (limit === null) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatUsage = (used: number, limit: number | null): string => {
    if (limit === null) return `${used} / Unlimited`;
    return `${used} / ${limit}`;
  };

  const usageItems = [
    {
      title: 'AI Conversations',
      icon: MessageCircle,
      used: currentUsage.aiConversations,
      limit: currentPlan.aiConversationsLimit,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Professional Sessions',
      icon: Users,
      used: currentUsage.professionalSessions,
      limit: currentPlan.professionalSessionsLimit,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Psychological Assessments',
      icon: Brain,
      used: currentUsage.psychologicalAssessments,
      limit: currentPlan.psychologicalAssessmentsLimit,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-chetna-primary" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className="bg-chetna-primary text-white text-lg px-3 py-1">
                {currentPlan.name}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Free tier
              </p>
            </div>
            <Button 
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="border-chetna-primary text-chetna-primary hover:bg-chetna-primary hover:text-white"
            >
              Change Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your usage for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {usageItems.map((item, index) => {
              const IconComponent = item.icon;
              const percentage = getUsagePercentage(item.used, item.limit);
              const isUnlimited = item.limit === null;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${item.bgColor}`}>
                        <IconComponent className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUnlimited && (
                        <Infinity className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatUsage(item.used, item.limit)}
                      </span>
                    </div>
                  </div>
                  
                  {!isUnlimited && (
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  )}
                  
                  {!isUnlimited && percentage >= 80 && (
                    <p className="text-xs text-orange-600">
                      {percentage >= 100 ? 'Limit reached' : 'Approaching limit'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Usage limits reset monthly. Need more? 
              <Button 
                variant="link" 
                className="p-0 h-auto text-chetna-primary hover:text-chetna-primary/90"
                onClick={() => navigate('/pricing')}
              >
                Upgrade your plan
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleUsageDashboard;
