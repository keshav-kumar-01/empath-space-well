
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  user_id: string;
};

const EditBlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      published: true,
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to edit this post.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        // Check if the current user is the author
        if (data.user_id !== user.id) {
          toast({
            title: "Permission denied",
            description: "You can only edit your own blog posts.",
            variant: "destructive",
          });
          navigate("/blog");
          return;
        }

        // Set form values
        form.reset({
          title: data.title,
          content: data.content,
          published: data.published,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error fetching blog post",
          description: "The post might have been deleted or you don't have permission to edit it.",
          variant: "destructive",
        });
        navigate("/blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate, toast, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user || !id) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: values.title,
          content: values.content,
          published: values.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Blog post updated successfully",
        description: values.published 
          ? "Your post is now live on the blog" 
          : "Your post has been saved as a draft",
      });
      
      navigate(`/blog/post/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error updating blog post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Blog Post | Chetna - Mental Wellness Blog</title>
        <meta name="description" content="Edit your blog post on Chetna mental health platform." />
        <meta name="keywords" content="edit blog post, mental health blog, update article" />
        <link rel="canonical" href={`https://chetna.life/blog/edit/${id}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/blog")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Button>

          <div className="bg-white/90 dark:bg-chetna-darker/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Blog Post</h1>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter a title for your blog post" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here..." 
                            className="min-h-[300px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {field.value 
                              ? "Your post is visible to everyone" 
                              : "Your post is saved as a draft"
                            }
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/blog/post/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="chetna-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Update Blog Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default EditBlogPost;
