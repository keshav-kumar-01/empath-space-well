import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { User, Settings, Book, MessageSquare, PenSquare, Calendar, Brain, TrendingUp, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [activeTab, setActiveTab] = useState("overview");
  
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-light via-white to-chetna-peach/20 dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Profile Header */}
        <Card className="bg-gradient-to-r from-white to-chetna-light/50 dark:from-card dark:to-chetna-dark/30 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 text-xl border-4 border-white shadow-lg">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-chetna-primary to-chetna-secondary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-muted-foreground text-lg">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/settings")}
                className="border-chetna-primary text-chetna-primary hover:bg-chetna-primary hover:text-white transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            
            {/* Enhanced Stats Cards */}
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-800">{stats?.totalPosts || 0}</p>
                    <p className="text-xs text-blue-600">Posts</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-800">{stats?.totalComments || 0}</p>
                    <p className="text-xs text-green-600">Comments</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-800">{stats?.totalUpvotes || 0}</p>
                    <p className="text-xs text-purple-600">Upvotes</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-orange-800">{stats?.journalStreak || 0}</p>
                    <p className="text-xs text-orange-600">Streak</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Brain className="h-6 w-6 text-teal-600 mb-2" />
                    <p className="text-2xl font-bold text-teal-800">{testResults?.length || 0}</p>
                    <p className="text-xs text-teal-600">Tests</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto bg-white dark:bg-card shadow-lg">
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
