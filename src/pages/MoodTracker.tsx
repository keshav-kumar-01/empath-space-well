
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Smile, Meh, Frown, Angry, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

const MoodTracker: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  const moods = [
    { value: 5, icon: Heart, label: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { value: 3, icon: Meh, label: 'Neutral', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { value: 2, icon: Frown, label: 'Not Great', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { value: 1, icon: Angry, label: 'Difficult', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const handleMoodSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today",
        variant: "destructive",
      });
      return;
    }

    const moodEntry = {
      date: selectedDate.toDateString(),
      mood: selectedMood,
      note: moodNote,
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for now (will be moved to Supabase later)
    const existingMoods = JSON.parse(localStorage.getItem('mood_history') || '[]');
    const updatedMoods = [moodEntry, ...existingMoods];
    localStorage.setItem('mood_history', JSON.stringify(updatedMoods));
    setMoodHistory(updatedMoods);

    toast({
      title: "Mood recorded! 💙",
      description: "Thank you for tracking your emotional wellness",
    });

    setSelectedMood(null);
    setMoodNote('');
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mood_history') || '[]');
    setMoodHistory(stored);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Mood Tracker - Chetna_AI</title>
        <meta name="description" content="Track your daily mood and emotional wellness with Chetna_AI" />
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
                className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity"
              >
                Record Mood
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
              {moodHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start tracking your mood to see patterns here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {moodHistory.slice(0, 10).map((entry, index) => {
                    const mood = moods.find(m => m.value === entry.mood);
                    const IconComponent = mood?.icon || Meh;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                        <IconComponent className={`h-5 w-5 ${mood?.color} mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{mood?.label}</p>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
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
