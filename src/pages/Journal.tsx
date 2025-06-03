
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, Save, X, Smile, Frown, Meh, BookOpen, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }
    
    const fetchEntries = async () => {
      try {
        console.log("Fetching journal entries for user:", user.id);
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching journal entries:", error);
          throw error;
        }
        
        setEntries(data || []);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        toast({
          title: "Failed to load journal entries",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [user, toast]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood(null);
    setIsCreating(false);
    setIsEditing(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Cannot save entry",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "Please login to save entries",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Saving journal entry for user:", user.id);
      if (isEditing) {
        const { error } = await supabase
          .from("journal_entries")
          .update({
            title,
            content,
            mood,
            updated_at: new Date().toISOString(),
          })
          .eq("id", isEditing)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error updating journal entry:", error);
          throw error;
        }

        setEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === isEditing
              ? { ...entry, title, content, mood: mood || entry.mood }
              : entry
          )
        );

        toast({
          title: "Entry updated",
          description: "Your journal entry has been updated",
        });
      } else {
        const { data, error } = await supabase
          .from("journal_entries")
          .insert([
            {
              title,
              content,
              mood,
              user_id: user.id
            },
          ])
          .select();

        if (error) {
          console.error("Error creating journal entry:", error);
          throw error;
        }

        if (data && data.length > 0) {
          setEntries(prev => [data[0], ...prev]);
        }

        toast({
          title: "Entry created",
          description: "Your new journal entry has been saved",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Failed to save entry",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || null);
    setIsEditing(entry.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      console.log("Deleting journal entry for user:", user.id);
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting journal entry:", error);
        throw error;
      }

      setEntries(entries.filter(entry => entry.id !== id));
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted",
      });
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast({
        title: "Failed to delete entry",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getMoodIcon = (mood: string | undefined) => {
    switch (mood) {
      case 'happy':
        return <Smile className="text-green-500" />;
      case 'sad':
        return <Frown className="text-blue-500" />;
      case 'neutral':
        return <Meh className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getMoodBadge = (mood: string | undefined) => {
    switch (mood) {
      case 'happy':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Happy</Badge>;
      case 'sad':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">Reflective</Badge>;
      case 'neutral':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">Neutral</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-peach dark:from-chetna-dark dark:to-chetna-darker">
        <Header />
        <div className="container mx-auto px-4 py-6 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BookOpen className="w-8 h-8 text-chetna-primary" />
            </div>
            <p className="text-lg text-muted-foreground">Loading your journal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-peach dark:from-chetna-dark dark:to-chetna-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-chetna-accent/8 to-chetna-primary/8 rounded-full blur-2xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-br from-chetna-peach/8 to-chetna-accent/8 rounded-full blur-2xl floating" style={{ animationDelay: '5s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-chetna-primary/6 to-chetna-lavender/12 rounded-full blur-3xl floating" style={{ animationDelay: '8s' }}></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-chetna-accent/10 to-chetna-primary/10 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-chetna-accent" />
            <span className="text-sm font-medium text-chetna-accent">Personal Reflection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-chetna-accent via-chetna-primary to-chetna-accent bg-clip-text text-transparent mb-4">
            My Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Document your thoughts, track your moods, and reflect on your mental wellness journey
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-chetna-primary">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chetna-accent">
                {entries.length > 0 ? Math.ceil((Date.now() - new Date(entries[entries.length - 1]?.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Days Journaling</div>
            </div>
          </div>
        </div>
        
        {/* New Entry Button */}
        {!isCreating && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setIsCreating(true)}
              className="chetna-button bg-gradient-to-r from-chetna-accent to-chetna-primary hover:from-chetna-primary hover:to-chetna-accent transform hover:scale-105 transition-all duration-300 shadow-glow"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Journal Entry
            </Button>
          </div>
        )}
        
        {/* Create/Edit Form */}
        {isCreating && (
          <Card className="feature-card p-6 mb-8 border-chetna-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-chetna-accent" />
              <h2 className="text-xl font-semibold text-chetna-dark dark:text-white">
                {isEditing ? "Edit Entry" : "New Entry"}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <Input
                  placeholder="What's on your mind today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium border-chetna-primary/20 focus:border-chetna-primary/50"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Share your thoughts, feelings, and reflections..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] border-chetna-primary/20 focus:border-chetna-primary/50"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-chetna-dark dark:text-white mb-3 block">
                  How are you feeling?
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant={mood === 'happy' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood('happy')}
                    className={mood === 'happy' ? "bg-green-500 hover:bg-green-600 text-white" : "border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"}
                  >
                    <Smile className="h-4 w-4 mr-1" />
                    Happy
                  </Button>
                  <Button
                    variant={mood === 'neutral' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood('neutral')}
                    className={mood === 'neutral' ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20"}
                  >
                    <Meh className="h-4 w-4 mr-1" />
                    Neutral
                  </Button>
                  <Button
                    variant={mood === 'sad' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood('sad')}
                    className={mood === 'sad' ? "bg-blue-500 hover:bg-blue-600 text-white" : "border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"}
                  >
                    <Frown className="h-4 w-4 mr-1" />
                    Reflective
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="chetna-button bg-gradient-to-r from-chetna-accent to-chetna-primary hover:from-chetna-primary hover:to-chetna-accent"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Entry
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Empty State */}
        {!isCreating && entries.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-chetna-accent/20 to-chetna-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-chetna-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-chetna-dark dark:text-white">Start Your Journey</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Begin documenting your thoughts and feelings. Journaling can help you understand yourself better and track your progress.
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="chetna-button bg-gradient-to-r from-chetna-accent to-chetna-primary hover:from-chetna-primary hover:to-chetna-accent"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Write Your First Entry
            </Button>
          </div>
        )}
        
        {/* Entries Grid */}
        {!isCreating && entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="feature-card group hover:shadow-glow hover:border-chetna-primary/30 transition-all duration-500 border-chetna-primary/10">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-chetna-accent" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getMoodBadge(entry.mood)}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                          className="h-8 w-8 text-chetna-primary hover:bg-chetna-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-chetna-dark dark:text-white line-clamp-2">
                    {entry.title}
                  </h3>
                  
                  <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                    {entry.content}
                  </p>
                  
                  {entry.mood && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-chetna-primary/10">
                      {getMoodIcon(entry.mood)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {entry.mood === 'sad' ? 'Reflective' : entry.mood} mood
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Journal;
