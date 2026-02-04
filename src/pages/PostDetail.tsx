
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { formatDistanceToNow } from "date-fns";
import { Heart, ArrowLeft, Send, Trash2, Smile, Meh, Frown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MoodType = "happy" | "neutral" | "sad" | null;

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  category: string | null;
  user_id: string | null;
  is_owner: boolean | null;
  mood?: MoodType;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const fetchPost = async (): Promise<Post> => {
    const { data, error } = await supabase
      .from("community_posts_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("Post not found");
    }
    
    return { ...(data as Post), author_name: "Anonymous" };
  };
  
  const fetchComments = async (): Promise<Comment[]> => {
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
  
  const { data: post, isLoading: postLoading, refetch: refetchPost } = useQuery({
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
  
  const isAuthor = post?.is_owner === true;
  
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
      const { error } = await supabase.rpc('increment_post_upvotes', {
        post_id: post.id
      });
        
      if (error) throw error;
      
      // Refetch to get updated upvote count
      refetchPost();
      
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
  
  const handleDeletePost = async () => {
    if (!isAuthor || !post) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Delete all comments for this post first
      await supabase
        .from("post_comments")
        .delete()
        .eq("post_id", post.id);
        
      // Then delete the post
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", post.id);
        
      if (error) throw error;
      
      toast({
        title: "Post deleted",
        description: "Your post has been removed successfully",
      });
      
      navigate("/community");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Failed to delete post",
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
  
  const getMoodIcon = (mood?: MoodType) => {
    switch(mood) {
      case "happy":
        return <Smile className="h-5 w-5 text-green-500" />;
      case "neutral":
        return <Meh className="h-5 w-5 text-amber-500" />;
      case "sad":
        return <Frown className="h-5 w-5 text-red-500" />;
      default:
        return null;
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
  
  const pageTitle = post ? `${post.title} - Community Discussion` : "Community Post";
  const pageDescription = post ? post.content.substring(0, 155) : "Join the conversation on Chetna mental health community";

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Chetna - Mental Wellness Community</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="mental health community, support forum, peer support, mental wellness discussion" />
        <link rel="canonical" href={`https://chetna.life/community/post/${id}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://chetna.life/community/post/${id}`} />
      </Helmet>
      
      <PageLayout>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/community")}
            className="group"
          >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
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
          <Card className="bg-white dark:bg-card overflow-hidden border border-border/30 dark:border-border/20">
            <CardHeader className="p-6 pb-4 bg-muted/20">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-3">
                  {post.mood && getMoodIcon(post.mood)}
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                {post.category && (
                  <Badge variant="outline" className="ml-2">
                    {post.category}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                Posted by {post.author_name || "Anonymous"} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </CardHeader>
            
            <CardContent className="p-6 pt-4">
              <div className="bg-muted/10 dark:bg-card/80 p-4 rounded-lg border border-border/20 dark:border-border/10 mb-4">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
            </CardContent>
            
            <CardFooter className="px-6 py-4 border-t flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handleUpvote}
                className="chetna-button text-white"
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Upvote ({post.upvotes})
              </Button>
              
              {isAuthor && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
            Post not found.
          </div>
        )}
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          
          <Card className="bg-white dark:bg-card border border-border/30 dark:border-border/20">
            <CardContent className="p-4">
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
                  className="self-end chetna-button"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4 mt-6">
            {commentsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-white dark:bg-card border border-border/30 dark:border-border/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-chetna-primary to-purple-400 text-white text-xs">
                          {comment.author_name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">
                        {comment.author_name || "Anonymous"} 
                        <span className="text-muted-foreground font-normal ml-2">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </p>
                    </div>
                    <div className="ml-11">
                      <p className="whitespace-pre-line text-sm">{comment.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-white dark:bg-card rounded-lg border border-border/30 dark:border-border/20">
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
          </div>
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </PageLayout>
    </>
  );
};

export default PostDetail;
