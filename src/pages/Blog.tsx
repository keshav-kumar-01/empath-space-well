import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { PlusCircle, BookOpen, Pencil, Clock, User, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint dark:from-chetna-dark dark:to-chetna-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-chetna-primary/8 to-chetna-accent/8 rounded-full blur-2xl floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-chetna-secondary/8 to-chetna-primary/8 rounded-full blur-2xl floating" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-chetna-accent/6 to-chetna-peach/12 rounded-full blur-3xl floating" style={{ animationDelay: '6s' }}></div>
      </div>

      <Helmet>
        <title>{t('navigation.blog')} | Chetna_AI</title>
        <meta name="description" content="Read and share thoughts on mental wellness in the Chetna_AI community blog." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-chetna-primary/10 to-chetna-accent/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-chetna-primary" />
            <span className="text-sm font-medium text-chetna-primary">Community Stories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('blog.subtitle')}
          </p>
          {user && (
            <Button 
              onClick={() => navigate("/blog/create")}
              className="chetna-button bg-gradient-to-r from-chetna-primary to-chetna-accent hover:from-chetna-accent hover:to-chetna-primary transform hover:scale-105 transition-all duration-300 shadow-glow"
              size="lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {t('blog.shareStory')}
            </Button>
          )}
        </div>

        <Separator className="mb-12 bg-gradient-to-r from-transparent via-chetna-primary/20 to-transparent" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="feature-card border-chetna-primary/10 animate-pulse">
                <CardHeader>
                  <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-chetna-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-chetna-dark dark:text-white">{t('blog.noStories')}</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t('blog.beFirst')}
            </p>
            {user ? (
              <Button
                onClick={() => navigate("/blog/create")}
                className="chetna-button bg-gradient-to-r from-chetna-primary to-chetna-accent hover:from-chetna-accent hover:to-chetna-primary"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('blog.writeFirst')}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="chetna-button bg-gradient-to-r from-chetna-primary to-chetna-accent hover:from-chetna-accent hover:to-chetna-primary"
                size="lg"
              >
                {t('blog.joinCommunity')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card 
                key={post.id}
                className="feature-card group border-chetna-primary/10 hover:shadow-glow hover:border-chetna-primary/30 transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/blog/post/${post.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-chetna-primary/10 text-chetna-primary border-chetna-primary/20 mb-2">
                      <Heart className="w-3 h-3 mr-1" />
                      {t('blog.wellnessStory')}
                    </Badge>
                    {user && user.id === post.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil size={16} />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-chetna-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                    {truncateContent(post.content)}
                  </p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    variant="ghost"
                    className="text-chetna-primary hover:text-chetna-primary/80 hover:bg-chetna-primary/10 px-0 group-hover:translate-x-1 transition-transform"
                  >
                    {t('blog.continueReading')}
                  </Button>
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
