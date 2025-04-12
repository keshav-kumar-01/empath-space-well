
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Meh, Frown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type MoodType = "happy" | "neutral" | "sad" | null;

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }).max(100, {
    message: "Title cannot exceed 100 characters",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters long",
  }).max(5000, {
    message: "Content cannot exceed 5000 characters",
  }),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
});

const categories = [
  "Mental Health",
  "Depression",
  "Anxiety",
  "Trauma",
  "Relationships",
  "Work Stress",
  "Study Pressure",
  "Peer Pressure",
  "Other"
];

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mood, setMood] = useState<MoodType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });
  
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          title: values.title,
          content: values.content,
          category: values.category,
          user_id: user.id,
          mood: mood,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Post created",
        description: "Your post has been shared with the community",
      });
      
      navigate(`/community/post/${data[0].id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Failed to create post",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/community")}
          className="mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Community
        </Button>
        
        <Card className="bg-white dark:bg-card border border-border/30 dark:border-border/20">
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>
              Share your thoughts, experiences, or ask for support from the community
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel htmlFor="mood">How are you feeling?</FormLabel>
                  <div className="mt-2">
                    <ToggleGroup type="single" value={mood || ""} onValueChange={(value) => setMood(value as MoodType || null)}>
                      <ToggleGroupItem value="happy" aria-label="Happy" className="flex gap-1.5 items-center">
                        <Smile className="h-5 w-5 text-green-500" />
                        <span>Happy</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="neutral" aria-label="Neutral" className="flex gap-1.5 items-center">
                        <Meh className="h-5 w-5 text-amber-500" />
                        <span>Neutral</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="sad" aria-label="Sad" className="flex gap-1.5 items-center">
                        <Frown className="h-5 w-5 text-red-500" />
                        <span>Sad</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <FormDescription className="mt-1.5">
                    Sharing your mood helps others understand your perspective better.
                  </FormDescription>
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts, experiences, or questions..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-end border-t py-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="chetna-button"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post to Community"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default CreatePost;
