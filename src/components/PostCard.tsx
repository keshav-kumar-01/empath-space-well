
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Trash2, MoreVertical, Smile, Meh, Frown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type MoodType = "happy" | "neutral" | "sad" | null;

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    upvotes: number;
    category: string | null;
    author_name?: string;
    comment_count?: number;
    user_id: string;
    mood?: MoodType;
  };
  onClick: () => void;
  onDelete?: () => void;
  showActions?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onClick, 
  onDelete,
  showActions = true 
}) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };
  
  const isAuthor = user && user.id === post.user_id;
  const canDelete = isAuthor || isAdmin;
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!canDelete) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", post.id);
        
      if (error) throw error;
      
      toast({
        title: "Post deleted",
        description: isAdmin && !isAuthor 
          ? "Post has been removed by admin" 
          : "Your post has been removed successfully",
      });
      
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getMoodIcon = () => {
    switch(post.mood) {
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

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-card border border-border/30 hover:border-border/60 dark:border-border/20 dark:hover:border-border/40"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1">
            <div className="flex gap-2 items-center mb-2">
              {post.mood && (
                <div className="shrink-0">
                  {getMoodIcon()}
                </div>
              )}
              <h3 className="text-lg font-semibold line-clamp-2 flex-1">{post.title}</h3>
            </div>
            <p className="text-muted-foreground mb-2 text-sm">
              Posted by {post.author_name || "Anonymous"} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
          
          {post.category && (
            <Badge variant="outline" className="shrink-0">
              {post.category}
            </Badge>
          )}
          
          {showActions && canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isAdmin && !isAuthor ? "Delete post (Admin)" : "Delete post"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-card/60 p-3 rounded-lg mb-2">
          <p className="line-clamp-3 text-sm">{truncateContent(post.content)}</p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-3 border-t flex justify-between bg-muted/20 dark:bg-muted/10">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Heart className="h-4 w-4 mr-1" />
          {post.upvotes || 0}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-1" />
          {post.comment_count || 0}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
