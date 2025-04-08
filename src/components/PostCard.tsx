
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
  };
  onClick: () => void;
};

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
          {post.category && (
            <Badge variant="outline" className="ml-2 shrink-0">
              {post.category}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mb-2 text-sm">
          Posted by {post.author_name || "Anonymous"} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
        <p className="line-clamp-3 text-sm">{truncateContent(post.content)}</p>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t flex justify-between">
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
