import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { User, Settings, Book, MessageSquare, PenSquare, Calendar, Brain, TrendingUp, Award, Heart, Activity, Target, Clock, Star, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  upvotes: number;
  category: string | null;
  user_id: string;
};

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
  user_id: string;
};

type ProfileStats = {
  totalPosts: number;
  totalComments: number;
  totalUpvotes: number;
  totalJournalEntries: number;
  journalStreak: number;
  lastJournalDate: string | null;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [moodData, setMoodData] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to view your profile",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

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
      icon: Book,
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
  
  // Fetch user's posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["user-posts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      return data as Post[];
    },
    enabled: !!user?.id,
  });
  
  // Fetch user's journal entries
  const { data: journalEntries, isLoading: journalLoading } = useQuery({
    queryKey: ["user-journal", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching journal entries:", error);
        throw error;
      }
      
      return data as JournalEntry[];
    },
    enabled: !!user?.id,
  });
  
  // Calculate user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async (): Promise<ProfileStats> => {
      if (!user?.id) {
        return {
          totalPosts: 0,
          totalComments: 0,
          totalUpvotes: 0,
          totalJournalEntries: 0,
          journalStreak: 0,
          lastJournalDate: null,
        };
      }
      
      // Get total posts
      const { count: postsCount, error: postsError } = await supabase
        .from("community_posts")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);
        
      // Get total comments
      const { count: commentsCount, error: commentsError } = await supabase
        .from("post_comments")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);
        
      // Get total upvotes received on posts
      const { data: userPosts, error: upvotesError } = await supabase
        .from("community_posts")
        .select("upvotes")
        .eq("user_id", user.id);
        
      const totalUpvotes = userPosts?.reduce((sum, post) => sum + post.upvotes, 0) || 0;
      
      // Get journal entries count
      const { count: journalCount, error: journalError } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);
        
      // Get the most recent journal entries to calculate streak
      const { data: recentEntries, error: recentError } = await supabase
        .from("journal_entries")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30); // Get the last 30 days of entries
        
      // Calculate journal streak
      let streak = 0;
      let lastJournalDate = null;
      
      if (recentEntries && recentEntries.length > 0) {
        lastJournalDate = recentEntries[0].created_at;
        
        // Simple streak calculation - consecutive days with entries
        const entriesByDay = new Map();
        
        recentEntries.forEach(entry => {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          entriesByDay.set(date, true);
        });
        
        const today = new Date().toISOString().split('T')[0];
        let currentDate = new Date();
        let currentDateStr = today;
        
        // Check if the user journaled today
        if (entriesByDay.has(currentDateStr)) {
          streak = 1;
          
          // Check previous days
          while (true) {
            currentDate.setDate(currentDate.getDate() - 1);
            currentDateStr = currentDate.toISOString().split('T')[0];
            
            if (entriesByDay.has(currentDateStr)) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
      
      if (postsError || commentsError || upvotesError || journalError || recentError) {
        console.error("Error calculating stats");
      }
      
      return {
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
        totalUpvotes,
        totalJournalEntries: journalCount || 0,
        journalStreak: streak,
        lastJournalDate,
      };
    },
    enabled: !!user?.id,
  });
  
  // Fetch user's test results
  const { data: testResults, isLoading: testsLoading } = useQuery({
    queryKey: ["user-test-results", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("psychological_test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching test results:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getSeverityColor = (severity: string) => {
    if (!severity) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low anxiety':
      case 'good':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'mild':
      case 'average':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'moderate':
      case 'moderately severe':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'severe':
      case 'needs attention':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getTestIcon = (testType: string) => {
    switch (testType.toLowerCase()) {
      case 'gad7':
      case 'bai':
        return '😰';
      case 'phq9':
      case 'bdi2':
        return '😔';
      case 'cpt':
        return '🧠';
      case 'mmpi2':
        return '🧑‍⚕️';
      case 'sis':
        return '💭';
      default:
        return '📋';
    }
  };

  const getTestDisplayName = (testType: string) => {
    const names = {
      'GAD7': 'Generalized Anxiety Disorder 7',
      'BAI': 'Beck Anxiety Inventory',
      'PHQ9': 'Patient Health Questionnaire-9',
      'BDI2': 'Beck Depression Inventory-II',
      'CPT': 'Continuous Performance Test',
      'MMPI2': 'Minnesota Multiphasic Personality Inventory-2',
      'SIS': 'Suicidal Ideation Scale'
    };
    return names[testType as keyof typeof names] || testType;
  };
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 space-y-10 max-w-7xl" role="main">
        {/* Enhanced Profile Header with better spacing */}
        <header aria-labelledby="profile-heading">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-accent/20">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative">
                  <Avatar className="w-28 h-28 text-2xl border-4 border-background shadow-xl" aria-label="Profile picture">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={`${user.name}'s profile picture`} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div 
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-background"
                    aria-label="Online status indicator"
                    role="status"
                  ></div>
                </div>
                
                <div className="flex-grow space-y-2">
                  <h1 id="profile-heading" className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground text-lg">{user.email}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>Member since {new Date().toLocaleDateString()}</span>
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate("/settings")}
                  className="gap-2 self-start md:self-center"
                  aria-label="Go to settings page"
                >
                  <Settings className="h-5 w-5" aria-hidden="true" />
                  Settings
                </Button>
              </div>
            
            {/* Enhanced Stats Cards with better spacing */}
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full" />
                ))}
              </div>
            ) : (
              <section aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="sr-only">Your activity statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
                  <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      <p className="text-3xl font-bold text-blue-800 dark:text-blue-200" aria-label={`${stats?.totalPosts || 0} posts created`}>
                        {stats?.totalPosts || 0}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Posts</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="h-7 w-7 text-green-600 dark:text-green-400" aria-hidden="true" />
                      <p className="text-3xl font-bold text-green-800 dark:text-green-200" aria-label={`${stats?.totalComments || 0} comments posted`}>
                        {stats?.totalComments || 0}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300 font-medium">Comments</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-2">
                      <TrendingUp className="h-7 w-7 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                      <p className="text-3xl font-bold text-purple-800 dark:text-purple-200" aria-label={`${stats?.totalUpvotes || 0} upvotes received`}>
                        {stats?.totalUpvotes || 0}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Upvotes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="h-7 w-7 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                      <p className="text-3xl font-bold text-orange-800 dark:text-orange-200" aria-label={`${stats?.journalStreak || 0} day journal streak`}>
                        {stats?.journalStreak || 0}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Day Streak</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-2">
                      <Brain className="h-7 w-7 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      <p className="text-3xl font-bold text-teal-800 dark:text-teal-200" aria-label={`${testResults?.length || 0} psychological tests completed`}>
                        {testResults?.length || 0}
                      </p>
                      <p className="text-sm text-teal-600 dark:text-teal-300 font-medium">Tests Done</p>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
            </CardContent>
          </Card>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 max-w-3xl mx-auto bg-white dark:bg-card shadow-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-chetna-primary data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-chetna-primary data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-chetna-primary data-[state=active]:text-white">
              Posts
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-chetna-primary data-[state=active]:text-white">
              Journal
            </TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:bg-chetna-primary data-[state=active]:text-white">
              Tests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="space-y-8">
              {/* Dashboard Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>
          </TabsContent>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recent Posts Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-800">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {postsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full mb-2" />
                    ))
                  ) : posts && posts.length > 0 ? (
                    <ul className="space-y-2">
                      {posts.slice(0, 5).map(post => (
                        <li 
                          key={post.id}
                          className="cursor-pointer hover:bg-muted p-2 rounded"
                          onClick={() => navigate(`/community/post/${post.id}`)}
                        >
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(post.created_at)} • {post.upvotes} upvotes
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No posts yet
                    </p>
                  )}
                  
                  {posts && posts.length > 0 && (
                    <Button 
                      variant="link" 
                      className="px-0 mt-2"
                      onClick={() => setActiveTab("posts")}
                    >
                      View all posts
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Journal Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-800">
                    <Book className="h-5 w-5 mr-2" />
                    Recent Journal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {journalLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full mb-2" />
                    ))
                  ) : journalEntries && journalEntries.length > 0 ? (
                    <ul className="space-y-2">
                      {journalEntries.slice(0, 5).map(entry => (
                        <li 
                          key={entry.id}
                          className="cursor-pointer hover:bg-muted p-2 rounded"
                          onClick={() => navigate(`/journal`)}
                        >
                          <p className="font-medium truncate">{entry.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(entry.created_at)}
                            {entry.mood && ` • Mood: ${entry.mood}`}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No journal entries yet
                    </p>
                  )}
                  
                  {journalEntries && journalEntries.length > 0 && (
                    <Button 
                      variant="link" 
                      className="px-0 mt-2"
                      onClick={() => setActiveTab("journal")}
                    >
                      View all journal entries
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Tests Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-purple-800">
                    <Brain className="h-5 w-5 mr-2" />
                    Recent Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {testsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full mb-2" />
                    ))
                  ) : testResults && testResults.length > 0 ? (
                    <ul className="space-y-3">
                      {testResults.slice(0, 3).map(test => (
                        <li 
                          key={test.id}
                          className="cursor-pointer hover:bg-muted p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                          onClick={() => setActiveTab("tests")}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTestIcon(test.test_type)}</span>
                              <div>
                                <p className="font-medium text-sm">{test.test_type}</p>
                                <p className="text-xs text-muted-foreground">
                                  Score: {test.total_score || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <Badge className={getSeverityColor(test.severity_level || '')}>
                              {test.severity_level || 'Complete'}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No tests taken yet</p>
                      <Button 
                        variant="link" 
                        className="px-0 mt-2 text-purple-600"
                        onClick={() => navigate("/psych-tests")}
                      >
                        Take your first test
                      </Button>
                    </div>
                  )}
                  
                  {testResults && testResults.length > 0 && (
                    <Button 
                      variant="link" 
                      className="px-0 mt-3 w-full text-purple-600"
                      onClick={() => setActiveTab("tests")}
                    >
                      View all tests
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Your Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Upvotes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map(post => (
                        <TableRow 
                          key={post.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/community/post/${post.id}`)}
                        >
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.category || "Uncategorized"}</TableCell>
                          <TableCell>{formatDate(post.created_at)}</TableCell>
                          <TableCell>{post.upvotes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
                    <Button onClick={() => navigate("/community/create")}>
                      Create your first post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenSquare className="h-5 w-5 mr-2" />
                  Your Journal Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {journalLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : journalEntries && journalEntries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Mood</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journalEntries.map(entry => (
                        <TableRow 
                          key={entry.id}
                          className="cursor-pointer"
                          onClick={() => navigate("/journal")}
                        >
                          <TableCell className="font-medium">{entry.title}</TableCell>
                          <TableCell>{entry.mood || "Not specified"}</TableCell>
                          <TableCell>{formatDate(entry.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any journal entries yet</p>
                    <Button onClick={() => navigate("/journal")}>
                      Start journaling
                    </Button>
                  </div>
                )}
                
                {journalEntries && journalEntries.length > 0 && (
                  <div className="mt-6 border p-4 rounded-lg bg-muted/30">
                    <h3 className="text-lg font-medium flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2" />
                      Journal Streak
                    </h3>
                    <p className="text-xl font-bold">{stats?.journalStreak || 0} {stats?.journalStreak === 1 ? 'day' : 'days'}</p>
                    {stats?.lastJournalDate && (
                      <p className="text-sm text-muted-foreground">
                        Last entry: {formatDate(stats.lastJournalDate)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center text-purple-800">
                  <Brain className="h-5 w-5 mr-2" />
                  Psychological Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {testsLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : testResults && testResults.length > 0 ? (
                  <div className="space-y-4">
                    {testResults.map(test => (
                      <Card key={test.id} className="border hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl">{getTestIcon(test.test_type)}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{getTestDisplayName(test.test_type)}</h3>
                                <p className="text-sm text-muted-foreground">{test.test_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Taken {formatDate(test.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-2xl font-bold text-chetna-primary">
                                    {test.total_score || 'N/A'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Score</p>
                                </div>
                                <Badge className={getSeverityColor(test.severity_level || '')}>
                                  {test.severity_level || 'Complete'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Test Results Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Take psychological assessments to track your mental wellness journey
                    </p>
                    <Button 
                      onClick={() => navigate("/psych-tests")}
                      className="bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:from-chetna-primary/90 hover:to-chetna-secondary/90"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Take Your First Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 text-center text-xs text-muted-foreground bg-gradient-to-r from-chetna-light/50 to-white">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default UserProfile;
