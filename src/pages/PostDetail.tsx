
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, ArrowLeft, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  category: string | null;
  user_id: string;
  author_name?: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
};

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  
  const fetchPost = async (): Promise<Post> => {
    // Type assertion for Supabase client
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      throw error;
    }
    
    // We're not using profiles table anymore since it doesn't exist
    // Simply use "Anonymous" as the author name
    const authorName = "Anonymous";
    
    return { ...(data as Post), author_name: authorName };
  };
  
  const fetchComments = async (): Promise<Comment[]> => {
    // Type assertion for Supabase client
    const { data, error } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Get author names for comments - simplified without profiles
    const commentsWithAuthors = (data as Comment[]).map(comment => {
      return { ...comment, author_name: "Anonymous" };
    });
    
    return commentsWithAuthors;
  };
  
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPost,
    enabled: !!id,
  });
  
  const { 
    data: comments, 
    isLoading: commentsLoading, 
    refetch: refetchComments 
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: fetchComments,
    enabled: !!id,
  });
  
  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to upvote",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!post) return;
    
    try {
      // Type assertion for Supabase client
      const { data, error } = await supabase
        .from("community_posts")
        .update({ upvotes: post.upvotes + 1 })
        .eq("id", post.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Post upvoted",
        description: "Thank you for your support!",
      });
    } catch (error) {
      console.error("Error upvoting post:", error);
      toast({
        title: "Failed to upvote",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to comment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Type assertion and direct values for Supabase client
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim(),
        } as any)
        .select();
        
      if (error) throw error;
      
      setNewComment("");
      refetchComments();
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to add comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    // Enable realtime subscription for comments
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${id}`
        },
        () => {
          refetchComments();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetchComments]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/community")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
        
        {postLoading ? (
          <Card className="bg-white dark:bg-card">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ) : post ? (
          <Card className="bg-white dark:bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {post.category && (
                  <Badge variant="outline" className="ml-2">
                    {post.category}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">
                Posted by {post.author_name || "Anonymous"} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
              
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
            
            <CardFooter className="px-6 py-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleUpvote}
                className="ml-auto"
              >
                <Heart className="h-4 w-4 mr-2" />
                Upvote ({post.upvotes})
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
            Post not found.
          </div>
        )}
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          
          <div className="flex gap-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
          
          <div className="space-y-4 mt-6">
            {commentsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-card">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-white dark:bg-card">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      {comment.author_name || "Anonymous"} • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                    <p className="whitespace-pre-line">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-6 bg-white dark:bg-card rounded-lg">
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default PostDetail;
