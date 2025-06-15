
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Moon, Sparkles, Eye, Heart, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { getAIResponse } from '@/services/aiService';

const DreamAnalysis = () => {
  const [dreamText, setDreamText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
        
        const aiInterpretation = await getAIResponse(prompt, () => 
          "Dreams often reflect our subconscious thoughts and emotions. This dream may represent your current mental state and inner feelings."
        );

        // Extract themes, emotions, and symbols (simplified for demo)
        const themes = ['transformation', 'anxiety', 'growth'];
        const emotions = ['curiosity', 'fear', 'hope'];
        const symbols = ['water', 'flying', 'house'];

        const { data, error } = await supabase
          .from('dream_analysis')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            dream_description: dreamDescription,
            ai_interpretation: aiInterpretation,
            themes,
            emotions,
            symbols,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dream-analysis'] });
      setDreamText('');
      toast.success('Dream analyzed successfully! 🌙');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      analyzeDreamMutation.mutate(dreamText);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌙 Dream Analysis</h1>
        <p className="text-gray-600">AI-powered interpretation of your dreams and subconscious mind</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
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
          <Card key={dream.id} className="hover:shadow-lg transition-shadow">
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
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">
                  "{dream.dream_description}"
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  🌸 Dr. Chetna's Interpretation
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800">{dream.ai_interpretation}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-purple-700">Themes</h5>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(dream.themes) && dream.themes.map((theme: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2 text-pink-700">Emotions</h5>
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
                  <h5 className="font-medium mb-2 text-blue-700">Symbols</h5>
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
          <Moon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dreams analyzed yet</h3>
          <p className="text-gray-600">Share your first dream to discover its hidden meanings!</p>
        </div>
      )}
    </div>
  );
};

export default DreamAnalysis;
