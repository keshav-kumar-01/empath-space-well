
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Heart, MessageSquare, Search, RefreshCcw, Users, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type MoodType = "happy" | "neutral" | "sad" | null;

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  upvotes: number;
  category: string | null;
  user_id: string;
  mood?: MoodType;
  author_name?: string;
  comment_count?: number;
};

const categories = [
  "All",
  "Mental Health",
  "Depression",
  "Anxiety",
  "Trauma",
  "Relationships",
  "Work Stress",
  "Study Pressure",
  "Peer Pressure",
  "Other"
];

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const fetchPosts = async (): Promise<Post[]> => {
    let query = supabase.from("community_posts").select("*");
    
    if (selectedCategory !== "All") {
      query = query.eq("category", selectedCategory);
    }
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    const postsWithComments = await Promise.all(
      (data as Post[]).map(async (post) => {
        const { count, error: countError } = await supabase
          .from("post_comments")
          .select("*", { count: "exact" })
          .eq("post_id", post.id);
          
        const authorName = "Anonymous";
        
        return {
          ...post,
          comment_count: countError ? 0 : (count || 0),
          author_name: authorName,
        };
      })
    );
    
    return postsWithComments;
  };
  
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", selectedCategory, searchTerm],
    queryFn: fetchPosts,
  });
  
  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate("/community/create");
  };
  
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => {
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint dark:from-chetna-dark dark:to-chetna-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-chetna-secondary/8 to-chetna-primary/8 rounded-full blur-2xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-br from-chetna-accent/8 to-chetna-secondary/8 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-br from-chetna-primary/6 to-chetna-mint/12 rounded-full blur-3xl floating" style={{ animationDelay: '7s' }}></div>
      </div>

      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-chetna-secondary/10 to-chetna-primary/10 rounded-full px-4 py-2 mb-4">
            <Users className="w-4 h-4 text-chetna-secondary" />
            <span className="text-sm font-medium text-chetna-secondary">Safe Space</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-chetna-secondary via-chetna-primary to-chetna-accent bg-clip-text text-transparent mb-4">
            Community Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with others, share your experiences, and find support in our caring community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="feature-card text-center p-6 border-chetna-secondary/20">
            <div className="w-12 h-12 bg-gradient-to-br from-chetna-secondary/20 to-chetna-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-chetna-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-chetna-secondary mb-2">{posts?.length || 0}</h3>
            <p className="text-muted-foreground">Community Posts</p>
          </div>
          <div className="feature-card text-center p-6 border-chetna-primary/20">
            <div className="w-12 h-12 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-chetna-primary" />
            </div>
            <h3 className="text-2xl font-bold text-chetna-primary mb-2">24/7</h3>
            <p className="text-muted-foreground">Support Available</p>
          </div>
          <div className="feature-card text-center p-6 border-chetna-accent/20">
            <div className="w-12 h-12 bg-gradient-to-br from-chetna-accent/20 to-chetna-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-chetna-accent" />
            </div>
            <h3 className="text-2xl font-bold text-chetna-accent mb-2">Safe</h3>
            <p className="text-muted-foreground">Judgment-Free Zone</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="feature-card p-6 border-chetna-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-chetna-dark dark:text-white mb-2">
                Share & Connect
              </h2>
              <p className="text-muted-foreground">
                Your voice matters. Share your thoughts and connect with others
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handleCreatePost} className="chetna-button bg-gradient-to-r from-chetna-secondary to-chetna-primary hover:from-chetna-primary hover:to-chetna-accent transform hover:scale-105 transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => refetch()}
                className="shrink-0 border-chetna-primary/30 hover:bg-chetna-primary/10"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10 border-chetna-primary/20 focus:border-chetna-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between border-chetna-primary/30 hover:bg-chetna-primary/10">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-chetna-darker/95 backdrop-blur-xl border-chetna-primary/20">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-chetna-primary/10 text-chetna-primary font-medium" : "hover:bg-chetna-primary/5"}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="feature-card p-6 border-chetna-primary/10">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="p-3 mb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))
          )}
          
          {error && (
            <div className="col-span-full feature-card p-8 text-center border-red-200 dark:border-red-800">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Oops! Something went wrong</h3>
              <p className="text-red-600 dark:text-red-400 mb-6">Failed to load posts. Please try again later.</p>
              <Button onClick={() => refetch()} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
          
          {posts && posts.length === 0 && (
            <div className="col-span-full feature-card p-12 text-center border-chetna-primary/10">
              <div className="w-20 h-20 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-chetna-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-chetna-dark dark:text-white">
                {searchTerm ? "No posts found" : "Start the conversation"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? "No results match your search. Try different keywords or browse all posts." 
                  : "Be the first to share your thoughts and connect with our supportive community"
                }
              </p>
              <Button onClick={handleCreatePost} className="chetna-button bg-gradient-to-r from-chetna-secondary to-chetna-primary hover:from-chetna-primary hover:to-chetna-accent" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {searchTerm ? "Create a Post" : "Share Your First Post"}
              </Button>
            </div>
          )}
          
          {posts && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/community/post/${post.id}`)}
              onDelete={refetch}
            />
          ))}
        </div>
      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-chetna-primary/10 bg-white/50 dark:bg-chetna-darker/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Chetna_AI - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default Community;
