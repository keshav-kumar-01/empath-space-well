
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error fetching blog post",
        description: "The post might have been deleted or you don't have permission to view it.",
        variant: "destructive",
      });
      navigate("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", post.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Post deleted successfully",
        description: "Your post has been permanently removed.",
      });
      navigate("/blog");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error deleting post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-3xl">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="mb-6 text-muted-foreground">
              The blog post you're looking for might have been removed or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate("/blog")} className="chetna-button">
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <SEO
        title={`${post.title} | Chetna_AI Blog`}
        description={post.content.substring(0, 160)}
        url={`https://chetna.live/blog/post/${post.id}`}
        type="article"
        article={{
          publishedTime: post.created_at,
          modifiedTime: post.updated_at,
          author: post.author_name,
          section: "Mental Health",
          tags: ["mental health", "wellness", "personal story"]
        }}
      />

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title }
          ]} />

          <Button 
            variant="ghost" 
            onClick={() => navigate("/blog")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Button>

          <article className="bg-white/90 dark:bg-chetna-darker/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm" itemScope itemType="https://schema.org/Article">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" itemProp="headline">{post.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                <span itemProp="author">By {post.author_name}</span>
                <span className="mx-2">•</span>
                <time dateTime={post.created_at} itemProp="datePublished">{formatDate(post.created_at)}</time>
                {post.updated_at !== post.created_at && (
                  <span className="italic ml-2" itemProp="dateModified">(Updated: {formatDate(post.updated_at)})</span>
                )}
              </div>

              {user && user.id === post.user_id && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/blog/edit/${post.id}`)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            <Separator className="mb-6" />

            <div className="prose dark:prose-invert max-w-none" itemProp="articleBody">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>

      <Footer />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogPost;
