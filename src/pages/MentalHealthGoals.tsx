
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Trophy, Star, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';

const MentalHealthGoals = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    goal_type: '',
    target_value: 0,
    target_date: '',
  });
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['mental-health-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mental_health_goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: typeof newGoal) => {
      const { data, error } = await supabase
        .from('mental_health_goals')
        .insert({
          ...goalData,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mental-health-goals'] });
      setIsCreateDialogOpen(false);
      setNewGoal({ title: '', description: '', goal_type: '', target_value: 0, target_date: '' });
      toast.success('Goal created successfully! 🎯');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, current_value }: { id: string; current_value: number }) => {
      const goal = goals?.find(g => g.id === id);
      const newValue = Math.min(current_value + 1, goal?.target_value || 0);
      const isCompleted = newValue >= (goal?.target_value || 0);
      
      const { data, error } = await supabase
        .from('mental_health_goals')
        .update({ 
          current_value: newValue,
          status: isCompleted ? 'completed' : 'active',
          reward_points: isCompleted ? (goal?.reward_points || 0) + 10 : goal?.reward_points,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mental-health-goals'] });
      if (data.status === 'completed') {
        toast.success('🎉 Goal completed! You earned 10 points!');
      } else {
        toast.success('Progress updated! Keep going! 💪');
      }
    },
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.goal_type) {
      createGoalMutation.mutate(newGoal);
    }
  };

  const getGoalTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      anxiety_reduction: '🧘',
      mood_improvement: '😊',
      sleep_quality: '😴',
      stress_management: '🌿',
      social_connection: '👥',
      mindfulness: '🧠',
    };
    return emojis[type] || '🎯';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return target > 0 ? (current / target) * 100 : 0;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Mental Health Goals</h1>
          <p className="text-gray-600">Track your progress and achieve your wellness objectives</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Mental Health Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                required
              />
              
              <Textarea
                placeholder="Goal description (optional)"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              />

              <Select 
                value={newGoal.goal_type} 
                onValueChange={(value) => setNewGoal({...newGoal, goal_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anxiety_reduction">🧘 Anxiety Reduction</SelectItem>
                  <SelectItem value="mood_improvement">😊 Mood Improvement</SelectItem>
                  <SelectItem value="sleep_quality">😴 Sleep Quality</SelectItem>
                  <SelectItem value="stress_management">🌿 Stress Management</SelectItem>
                  <SelectItem value="social_connection">👥 Social Connection</SelectItem>
                  <SelectItem value="mindfulness">🧠 Mindfulness</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Target value (e.g., 30 days)"
                value={newGoal.target_value}
                onChange={(e) => setNewGoal({...newGoal, target_value: parseInt(e.target.value) || 0})}
                required
              />

              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
              />

              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {goals?.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getGoalTypeEmoji(goal.goal_type)}</span>
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(goal.status || 'active')} text-white`}>
                    {goal.status}
                  </Badge>
                  {goal.reward_points && goal.reward_points > 0 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      <Star className="h-3 w-3 mr-1" />
                      {goal.reward_points} pts
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {goal.current_value || 0} / {goal.target_value}
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(goal.current_value || 0, goal.target_value || 0)} 
                  className="h-2"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {goal.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {goal.goal_type.replace('_', ' ')}
                  </div>
                </div>

                {goal.status === 'active' && (
                  <Button
                    size="sm"
                    onClick={() => updateGoalMutation.mutate({ 
                      id: goal.id, 
                      current_value: goal.current_value || 0 
                    })}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    +1 Progress
                  </Button>
                )}

                {goal.status === 'completed' && (
                  <Badge className="bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    Completed!
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
          <p className="text-gray-600">Create your first mental health goal to start your journey!</p>
        </div>
      )}
    </div>
  );
};

export default MentalHealthGoals;
