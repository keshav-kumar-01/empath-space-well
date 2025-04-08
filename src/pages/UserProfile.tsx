
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { User, Settings, Book, MessageSquare, PenSquare, Calendar } from "lucide-react";
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
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="w-20 h-20 text-lg">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{stats?.totalPosts || 0}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{stats?.totalComments || 0}</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{stats?.totalUpvotes || 0}</p>
                    <p className="text-sm text-muted-foreground">Upvotes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{stats?.journalStreak || 0}</p>
                    <p className="text-sm text-muted-foreground">Journal Streak</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="h-5 w-5 mr-2" />
                    Recent Journal Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
        </Tabs>
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default UserProfile;
