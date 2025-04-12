
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Heart, MessageSquare, Search, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  // For UI purposes
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
    
    // Get comment counts for each post
    const postsWithComments = await Promise.all(
      (data as Post[]).map(async (post) => {
        const { count, error: countError } = await supabase
          .from("post_comments")
          .select("*", { count: "exact" })
          .eq("post_id", post.id);
          
        // We're not using profiles table anymore since it doesn't exist
        // Simply use "Anonymous" as the author name
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
    // Enable realtime subscription for posts
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="bg-white dark:bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-border/30 dark:border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-chetna-primary to-purple-400 bg-clip-text text-transparent">
                Community Support
              </h1>
              <p className="text-muted-foreground mt-1">
                Share your thoughts and connect with others
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handleCreatePost} className="chetna-button">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => refetch()}
                className="shrink-0"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory}
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-muted font-medium" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-lg p-6 shadow-md">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="p-3 mb-3">
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
            <div className="col-span-full bg-red-100 dark:bg-red-900/20 p-6 rounded-lg text-center">
              <p className="text-red-700 dark:text-red-300">Failed to load posts. Please try again later.</p>
              <Button onClick={() => refetch()} variant="outline" className="mt-2">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          )}
          
          {posts && posts.length === 0 && (
            <div className="col-span-full bg-white dark:bg-card rounded-xl p-8 text-center shadow-md border border-border/30 dark:border-border/20">
              <h3 className="text-xl font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "No results match your search" : "Be the first to share in this category"}
              </p>
              <Button onClick={handleCreatePost} className="chetna-button">
                <Plus className="mr-2 h-4 w-4" />
                Create the first post
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
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default Community;
