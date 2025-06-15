
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, Sparkles, Play, Pause, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getAIResponse } from '@/services/aiService';

const WellnessPlans = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['wellness-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wellness_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (planType: 'daily' | 'weekly' | 'monthly') => {
      setIsGenerating(true);
      try {
        const prompt = `Generate a personalized ${planType} mental health wellness plan with specific activities, meditation exercises, and self-care tasks. Include timing and brief descriptions for each activity.`;
        
        const aiResponse = await getAIResponse(prompt, () => "Plan generated successfully!");
        
        const activities = [
          { name: "Morning Meditation", duration: "10 minutes", type: "mindfulness" },
          { name: "Gratitude Journaling", duration: "5 minutes", type: "reflection" },
          { name: "Deep Breathing Exercise", duration: "5 minutes", type: "breathing" },
          { name: "Nature Walk", duration: "20 minutes", type: "physical" },
          { name: "Evening Reflection", duration: "10 minutes", type: "reflection" }
        ];

        const { data, error } = await supabase
          .from('wellness_plans')
          .insert({
            plan_type: planType,
            title: `AI-Generated ${planType.charAt(0).toUpperCase() + planType.slice(1)} Wellness Plan`,
            description: aiResponse,
            activities: activities,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellness-plans'] });
      toast.success('Wellness plan generated successfully! 🌸');
    },
    onError: (error) => {
      toast.error('Failed to generate wellness plan');
      console.error(error);
    },
  });

  const updatePlanStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('wellness_plans')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellness-plans'] });
      toast.success('Plan status updated! 💖');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌸 AI Wellness Plans</h1>
        <p className="text-gray-600">Personalized mental health routines designed just for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Button
          onClick={() => generatePlanMutation.mutate('daily')}
          disabled={isGenerating}
          className="h-16 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Daily Plan
        </Button>
        <Button
          onClick={() => generatePlanMutation.mutate('weekly')}
          disabled={isGenerating}
          className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Generate Weekly Plan
        </Button>
        <Button
          onClick={() => generatePlanMutation.mutate('monthly')}
          disabled={isGenerating}
          className="h-16 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          <Target className="mr-2 h-5 w-5" />
          Generate Monthly Plan
        </Button>
      </div>

      <div className="space-y-4">
        {plans?.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.title}
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                <div className="flex gap-2">
                  {plan.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updatePlanStatus.mutate({ id: plan.id, status: 'paused' })}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {plan.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updatePlanStatus.mutate({ id: plan.id, status: 'active' })}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePlanStatus.mutate({ id: plan.id, status: 'completed' })}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(plan.activities) && plan.activities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans?.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No wellness plans yet</h3>
          <p className="text-gray-600">Generate your first AI-powered wellness plan to get started!</p>
        </div>
      )}
    </div>
  );
};

export default WellnessPlans;
