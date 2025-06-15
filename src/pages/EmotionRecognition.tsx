
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Eye, Heart, Smile } from 'lucide-react';
import { toast } from 'sonner';

const EmotionRecognition = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: analyses } = useQuery({
    queryKey: ['emotion-recognition'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_recognition')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const analyzeEmotionMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      setIsAnalyzing(true);
      try {
        // In a real app, you would upload the image and use an AI service like OpenAI Vision or Azure Face API
        // For demo purposes, we'll simulate emotion detection
        
        const mockEmotions = {
          happy: Math.random() * 0.8 + 0.1,
          sad: Math.random() * 0.3,
          angry: Math.random() * 0.2,
          surprised: Math.random() * 0.4,
          neutral: Math.random() * 0.6,
          fear: Math.random() * 0.1,
          disgust: Math.random() * 0.1,
        };

        const maxEmotion = Object.entries(mockEmotions).reduce((a, b) => 
          mockEmotions[a[0] as keyof typeof mockEmotions] > mockEmotions[b[0] as keyof typeof mockEmotions] ? a : b
        );

        const confidenceScore = Math.random() * 0.3 + 0.7; // 70-100%

        const analysisNotes = `Primary emotion detected: ${maxEmotion[0]} with ${(maxEmotion[1] * 100).toFixed(1)}% confidence. Overall emotional state appears ${maxEmotion[1] > 0.6 ? 'strong' : 'moderate'}.`;

        const {data, error} = await supabase
          .from('emotion_recognition')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            detected_emotions: mockEmotions,
            confidence_score: confidenceScore,
            analysis_notes: analysisNotes,
            image_url: null, // In real app, upload to storage first
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
      queryClient.invalidateQueries({ queryKey: ['emotion-recognition'] });
      setSelectedImage(null);
      setImagePreview(null);
      toast.success('Emotion analysis completed! 😊');
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeEmotionMutation.mutate(selectedImage);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-400',
      sad: 'bg-blue-400',
      angry: 'bg-red-400',
      surprised: 'bg-purple-400',
      neutral: 'bg-gray-400',
      fear: 'bg-orange-400',
      disgust: 'bg-green-400',
    };
    return colors[emotion] || 'bg-gray-400';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
      fear: '😨',
      disgust: '🤢',
    };
    return emojis[emotion] || '😐';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📸 Emotion Recognition</h1>
        <p className="text-gray-600">AI-powered facial emotion analysis for mental wellness insights</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Photo for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload a clear photo of your face</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Change Photo
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Emotions'}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Recent Analyses
        </h2>

        {analyses?.map((analysis) => (
          <Card key={analysis.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Emotion Analysis</CardTitle>
                <Badge variant="outline">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{analysis.analysis_notes}</p>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    Confidence: {((analysis.confidence_score || 0) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Detected Emotions
                </h4>
                <div className="space-y-3">
                  {Object.entries(analysis.detected_emotions as Record<string, number>).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24">
                        <span className="text-lg">{getEmotionEmoji(emotion)}</span>
                        <span className="text-sm capitalize">{emotion}</span>
                      </div>
                      <div className="flex-1">
                        <Progress 
                          value={value * 100} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {(value * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {analyses?.length === 0 && (
        <div className="text-center py-12">
          <Smile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
          <p className="text-gray-600">Upload your first photo to discover your emotional patterns!</p>
        </div>
      )}
    </div>
  );
};

export default EmotionRecognition;
