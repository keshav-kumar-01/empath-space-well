
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Heart, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  upvotes: number;
  category: string | null;
  user_id: string;
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
  "Other"
];

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const fetchPosts = async (): Promise<Post[]> => {
    const query = selectedCategory === "All" 
      ? supabase.from("community_posts").select("*").order("created_at", { ascending: false })
      : supabase.from("community_posts").select("*").eq("category", selectedCategory).order("created_at", { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Get comment counts for each post
    const postsWithComments = await Promise.all(
      data.map(async (post) => {
        const { count, error: countError } = await supabase
          .from("post_comments")
          .select("*", { count: "exact" })
          .eq("post_id", post.id);
          
        // Try to get author name
        let authorName = "Anonymous";
        try {
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", post.user_id)
            .maybeSingle();
          
          if (userData && userData.name) {
            authorName = userData.name;
          }
        } catch (error) {
          console.log("Could not fetch author name");
        }
        
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
    queryKey: ["posts", selectedCategory],
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
    refetch();
  }, [selectedCategory, refetch]);
  
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Community Support</h1>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleCreatePost}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {isLoading && (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-lg p-6 shadow-md">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          )}
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
              Failed to load posts. Please try again later.
            </div>
          )}
          
          {posts && posts.length === 0 && (
            <div className="bg-white dark:bg-card rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No posts found in this category.</p>
              <Button onClick={handleCreatePost} className="mt-4">
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
            />
          ))}
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default Community;
