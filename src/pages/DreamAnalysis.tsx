import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Moon, Sparkles, Eye, Heart, Lightbulb, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getAIResponse } from '@/services/aiService';
import FollowUpSuggestions from '@/components/FollowUpSuggestions';

const DreamAnalysis = () => {
  const [dreamText, setDreamText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: dreams, isLoading } = useQuery({
    queryKey: ['dream-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dream_analysis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const analyzeDreamMutation = useMutation({
    mutationFn: async (dreamDescription: string) => {
      setIsAnalyzing(true);
      try {
        const prompt = `Analyze this dream from a psychological perspective. Provide insights about themes, emotions, and possible meanings: "${dreamDescription}"`;
        
        const aiResult = await getAIResponse(prompt, () => 
          "Dreams often reflect our subconscious thoughts and emotions. This dream may represent your current mental state and inner feelings."
        );

        // Extract themes, emotions, and symbols (simplified for demo)
        const themes = ['transformation', 'anxiety', 'growth'];
        const emotions = ['curiosity', 'fear', 'hope'];
        const symbols = ['water', 'flying', 'house'];

        const { data, error } = await supabase
          .from('dream_analysis')
          .insert([{
            user_id: (await supabase.auth.getUser()).data.user?.id!,
            dream_description: dreamDescription,
            ai_interpretation: aiResult.response,
            themes,
            emotions,
            symbols,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dream-analysis'] });
      setDreamText('');
      toast.success('Dream analyzed successfully! 🌙');
      // Set dream-specific follow-ups
      setFollowUpSuggestions([
        "What does this dream symbol mean?",
        "How can I have more meaningful dreams?",
        "Is this a recurring pattern?",
        "What actions should I take based on this?"
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      analyzeDreamMutation.mutate(dreamText);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Dream Analysis - Chetna_AI</title>
        <meta name="description" content="AI-powered dream interpretation and analysis for mental wellness insights with Chetna_AI" />
        <link rel="canonical" href="https://chetna.live/dream-analysis" />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🌙 Dream Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered interpretation of your dreams and subconscious mind
          </p>
        </div>

        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Demo Feature:</strong> This feature uses simplified theme/emotion extraction. 
            AI interpretation is provided by Dr. Chetna, but themes and symbols shown are illustrative examples.
          </AlertDescription>
        </Alert>

        <Card className="mb-8 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-500" />
              Share Your Dream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Describe your dream in detail... What did you see, feel, or experience?"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <Button 
                type="submit" 
                disabled={!dreamText.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Dream...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Dream
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {dreams?.map((dream) => (
            <Card key={dream.id} className="hover:shadow-lg transition-shadow backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Dream Analysis</CardTitle>
                  <Badge variant="outline">
                    {new Date(dream.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Your Dream
                  </h4>
                  <p className="text-muted-foreground bg-muted p-4 rounded-lg italic">
                    "{dream.dream_description}"
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    🌸 Dr. Chetna's Interpretation
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-foreground">{dream.ai_interpretation}</p>
                    
                    {/* Follow-up suggestions for the most recent dream */}
                    {dreams && dreams[0]?.id === dream.id && (
                      <FollowUpSuggestions
                        suggestions={followUpSuggestions}
                        isVisible={followUpSuggestions.length > 0}
                        onSelect={(suggestion) => {
                          setDreamText(suggestion);
                          setFollowUpSuggestions([]);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-400">Themes</h5>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(dream.themes) && dream.themes.map((theme: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2 text-pink-700 dark:text-pink-400">Emotions</h5>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(dream.emotions) && dream.emotions.map((emotion: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-400">Symbols</h5>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(dream.symbols) && dream.symbols.map((symbol: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {dreams?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No dreams analyzed yet</h3>
            <p className="text-muted-foreground">Share your first dream to discover its hidden meanings!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DreamAnalysis;
