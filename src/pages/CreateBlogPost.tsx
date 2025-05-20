
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const CreateBlogPost: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a blog post.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: values.title,
          content: values.content,
          user_id: user.id,
          author_name: user.email?.split('@')[0] || "Anonymous",
          published: values.published,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Blog post created successfully",
        description: values.published 
          ? "Your post is now live on the blog" 
          : "Your post has been saved as a draft",
      });
      
      navigate(`/blog/post/${data.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating blog post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a blog post.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>Create Blog Post | Chetna_AI</title>
        <meta name="description" content="Share your thoughts and experiences with the Chetna_AI community." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Create a New Blog Post</h1>

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
                        <FormLabel className="text-base">Publish immediately</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Your post will be visible to everyone
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
                    onClick={() => navigate("/blog")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="chetna-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Blog Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBlogPost;
