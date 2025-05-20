
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { PlusCircle, BookOpen, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string;
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error fetching blog posts",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (postId: string) => {
    navigate(`/blog/edit/${postId}`);
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>Blog | Chetna_AI</title>
        <meta name="description" content="Read and share thoughts on mental wellness in the Chetna_AI community blog." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-chetna-dark dark:text-white">
              Community Blog
            </h1>
            <p className="text-muted-foreground mt-2">
              Share your thoughts, experiences, and insights with the community
            </p>
          </div>
          {user && (
            <Button 
              onClick={() => navigate("/blog/create")}
              className="chetna-button flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Write a Post
            </Button>
          )}
        </div>

        <Separator className="mb-8" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border-chetna-primary/10 animate-pulse">
                <CardHeader>
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your thoughts with the community
            </p>
            {user ? (
              <Button
                onClick={() => navigate("/blog/create")}
                className="chetna-button"
              >
                Write a Post
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="chetna-button"
              >
                Login to Write
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card 
                key={post.id}
                className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border-chetna-primary/10 hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 hover:text-chetna-primary transition-colors cursor-pointer" onClick={() => navigate(`/blog/post/${post.id}`)}>
                    {post.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {post.author_name} • {formatDate(post.created_at)}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-4">
                    {truncateContent(post.content)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/blog/post/${post.id}`)}
                    className="text-chetna-primary hover:text-chetna-primary/80 px-0"
                  >
                    Read more
                  </Button>
                  {user && user.id === post.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(post.id)}
                      className="text-muted-foreground"
                    >
                      <Pencil size={16} />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
