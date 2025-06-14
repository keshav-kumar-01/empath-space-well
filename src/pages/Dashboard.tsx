
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress }  from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { TrendingUp, Heart, Calendar, MessageSquare, BookOpen, Target, Activity, Clock, Star, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  useEffect(() => {
    // Load mood data from localStorage
    const stored = JSON.parse(localStorage.getItem('mood_history') || '[]');
    setMoodData(stored);
    
    // Calculate streak
    calculateStreak(stored);
  }, []);

  const calculateStreak = (moods: any[]) => {
    if (moods.length === 0) return;
    
    const today = new Date().toDateString();
    const sortedMoods = moods.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const mood of sortedMoods) {
      const moodDate = new Date(mood.timestamp).toDateString();
      const expectedDate = currentDate.toDateString();
      
      if (moodDate === expectedDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreakCount(streak);
  };

  const getAverageMood = () => {
    if (moodData.length === 0) return 0;
    const recentMoods = moodData.slice(0, 7); // Last 7 entries
    const average = recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / recentMoods.length;
    return Math.round(average * 10) / 10;
  };

  const getWeeklyProgress = () => {
    const thisWeek = moodData.filter(mood => {
      const moodDate = new Date(mood.timestamp);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return moodDate >= oneWeekAgo;
    });
    return Math.min((thisWeek.length / weeklyGoal) * 100, 100);
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return 'stable';
    const recent = moodData.slice(0, 3);
    const older = moodData.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, mood) => sum + mood.mood, 0) / recent.length;
    const olderAvg = older.reduce((sum, mood) => sum + mood.mood, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.3) return 'improving';
    if (recentAvg < olderAvg - 0.3) return 'declining';
    return 'stable';
  };

  const quickActions = [
    {
      title: "Track Mood",
      description: "Record how you're feeling today",
      icon: Heart,
      link: "/mood-tracker",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Chat with Chetna",
      description: "Get AI-powered support",
      icon: MessageSquare,
      link: "/",
      color: "from-chetna-primary to-chetna-secondary"
    },
    {
      title: "Browse Resources",
      description: "Explore articles and exercises",
      icon: BookOpen,
      link: "/resources",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Crisis Support",
      description: "Get immediate help",
      icon: Users,
      link: "/crisis-support",
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Dashboard - Chetna_AI</title>
        <meta name="description" content="Your personal mental wellness dashboard" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name || 'Friend'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your mental wellness overview
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mood Streak</p>
                  <p className="text-2xl font-bold">{streakCount} days</p>
                </div>
                <Activity className="h-8 w-8 text-chetna-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                  <p className="text-2xl font-bold">{getAverageMood()}/5</p>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weekly Goal</p>
                  <p className="text-2xl font-bold">{Math.round(getWeeklyProgress())}%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mood Trend</p>
                  <p className="text-2xl font-bold capitalize">{getMoodTrend()}</p>
                </div>
                <TrendingUp className={`h-8 w-8 ${
                  getMoodTrend() === 'improving' ? 'text-green-500' : 
                  getMoodTrend() === 'declining' ? 'text-red-500' : 
                  'text-blue-500'
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to support your wellness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={index} to={action.link}>
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:opacity-90 transition-opacity cursor-pointer`}>
                        <IconComponent className="h-8 w-8 mb-3" />
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chetna-primary" />
                Weekly Progress
              </CardTitle>
              <CardDescription>
                Track your wellness activities this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mood Check-ins</span>
                    <span>{moodData.filter(m => {
                      const moodDate = new Date(m.timestamp);
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      return moodDate >= oneWeekAgo;
                    }).length}/{weeklyGoal}</span>
                  </div>
                  <Progress value={getWeeklyProgress()} className="h-2" />
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">This Week's Insights</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>You've been consistent with mood tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Best time for check-ins: Evenings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span>Your mood trend is {getMoodTrend()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
