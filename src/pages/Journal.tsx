import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, Save, X, Smile, Frown, Meh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
        <Header />
        <div className="container mx-auto px-4 py-6 flex-grow flex items-center justify-center">
          <p>Loading journal entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Journal</h1>
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-chetna-primary hover:bg-chetna-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> New Entry
            </Button>
          )}
        </div>
        
        {isCreating ? (
          <Card className="p-4 mb-6">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Mood:</span>
                <Button
                  variant={mood === 'happy' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood('happy')}
                  className={mood === 'happy' ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  variant={mood === 'neutral' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood('neutral')}
                  className={mood === 'neutral' ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  <Meh className="h-4 w-4" />
                </Button>
                <Button
                  variant={mood === 'sad' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood('sad')}
                  className={mood === 'sad' ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Frown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-chetna-primary hover:bg-chetna-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          entries.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No journal entries yet.</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-chetna-primary hover:bg-chetna-primary/90"
              >
                Start Journaling
              </Button>
            </div>
          )
        )}
        
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{entry.title}</h3>
                  {getMoodIcon(entry.mood)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(entry.created_at)}
              </p>
              <p className="mt-3 whitespace-pre-wrap">{entry.content}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Journal;
