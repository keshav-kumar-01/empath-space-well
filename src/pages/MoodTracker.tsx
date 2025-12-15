import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Heart, Smile, Meh, Frown, Angry, TrendingUp, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: number;
  notes: string | null;
  created_at: string;
}

const MoodTracker: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');

  const moods = [
    { value: 5, icon: Heart, label: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { value: 3, icon: Meh, label: 'Neutral', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { value: 2, icon: Frown, label: 'Not Great', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { value: 1, icon: Angry, label: 'Difficult', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  ];

  // Fetch mood entries from database
  const { data: moodHistory, isLoading } = useQuery({
    queryKey: ['mood-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });

  // Create mood entry mutation
  const createMoodMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedMood) throw new Error('Missing data');

      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          notes: moodNote || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] });
      toast.success('Mood recorded! 💙');
      setSelectedMood(null);
      setMoodNote('');
    },
    onError: (error) => {
      toast.error('Failed to save mood. Please try again.');
      console.error('Mood save error:', error);
    },
  });

  const handleMoodSubmit = () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    if (!user) {
      toast.error('Please sign in to track your mood');
      return;
    }

    createMoodMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Mood Tracker - Chetna_AI</title>
        <meta name="description" content="Track your daily mood and emotional wellness with Chetna_AI" />
        <link rel="canonical" href="https://chetna.live/mood-tracker" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            Mood Tracker 💙
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your daily emotional wellness and identify patterns in your mental health journey
          </p>
        </div>

        {!user && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <CardContent className="pt-6">
              <p className="text-amber-800 dark:text-amber-200 text-center">
                Please <a href="/login" className="underline font-medium">sign in</a> to track and save your mood history.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Entry */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-chetna-primary" />
                How are you feeling today?
              </CardTitle>
              <CardDescription>
                Select your current mood and add any notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 rounded-2xl transition-all duration-300 ${
                        selectedMood === mood.value
                          ? `${mood.bgColor} ring-2 ring-chetna-primary scale-105`
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                      }`}
                      aria-label={`Select mood: ${mood.label}`}
                    >
                      <IconComponent className={`h-8 w-8 mx-auto ${mood.color}`} />
                      <p className="text-xs mt-2 font-medium">{mood.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Add a note (optional)</label>
                <Textarea
                  placeholder="What's on your mind? Share your thoughts..."
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleMoodSubmit}
                disabled={!selectedMood || createMoodMutation.isPending || !user}
                className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity"
              >
                {createMoodMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Record Mood'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Mood History */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chetna-secondary" />
                Your Mood Journey
              </CardTitle>
              <CardDescription>
                Recent mood entries and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !moodHistory || moodHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start tracking your mood to see patterns here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {moodHistory.map((entry) => {
                    const mood = moods.find(m => m.value === entry.mood);
                    const IconComponent = mood?.icon || Meh;
                    return (
                      <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                        <IconComponent className={`h-5 w-5 ${mood?.color} mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{mood?.label}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MoodTracker;
