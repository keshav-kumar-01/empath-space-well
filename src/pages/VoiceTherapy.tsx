import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Play, Square, Heart, Brain, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getAIResponse } from '@/services/aiService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const VoiceTherapy = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionType, setSessionType] = useState<'anxiety' | 'stress' | 'depression' | 'general'>('general');
  const [moodBefore, setMoodBefore] = useState([5]);
  const [moodAfter, setMoodAfter] = useState([5]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: sessions } = useQuery({
    queryKey: ['voice-therapy-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_therapy_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: {
      sessionType: string;
      duration: number;
      transcript: string;
      moodBefore: number;
      moodAfter: number;
    }) => {
      const aiResponse = await getAIResponse(
        `Provide therapeutic guidance for someone dealing with ${sessionData.sessionType}. They shared: "${sessionData.transcript}". Give warm, supportive advice.`,
        () => "Thank you for sharing. Remember, you're not alone in this journey. 💙"
      );

      const { data, error } = await supabase
        .from('voice_therapy_sessions')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          session_type: sessionData.sessionType,
          duration: sessionData.duration,
          transcript: sessionData.transcript,
          ai_response: aiResponse,
          mood_before: sessionData.moodBefore,
          mood_after: sessionData.moodAfter,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, aiResponse };
    },
    onSuccess: ({ aiResponse }) => {
      toast.success('Session completed! Here\'s your personalized guidance 🌸');
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Demo: Simulated transcript (real implementation would use speech-to-text API)
        const sampleTranscript = "I've been feeling overwhelmed lately with work and personal life. It's hard to find balance.";
        
        createSessionMutation.mutate({
          sessionType,
          duration: recordingDuration,
          transcript: sampleTranscript,
          moodBefore: moodBefore[0],
          moodAfter: moodAfter[0],
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast.success('Recording started! Speak your thoughts 🎤');
    } catch (error) {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>Voice Therapy Sessions | Chetna AI - AI Mental Health Support</title>
        <meta name="description" content="Experience AI-powered voice therapy sessions with Chetna AI. Record your thoughts and receive personalized therapeutic guidance for anxiety, stress, and emotional wellness." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto p-6 space-y-6 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🎤 Voice Therapy Sessions</h1>
          <p className="text-muted-foreground">AI-powered voice conversations for mental wellness</p>
        </div>

        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Demo Feature:</strong> This is a demonstration of voice therapy. Currently, a simulated transcript is used instead of real speech-to-text conversion. Full speech recognition will be available in future updates.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Start New Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Session Focus</label>
              <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anxiety">Anxiety Relief</SelectItem>
                  <SelectItem value="stress">Stress Management</SelectItem>
                  <SelectItem value="depression">Mood Support</SelectItem>
                  <SelectItem value="general">General Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Mood: {getMoodEmoji(moodBefore[0])} ({moodBefore[0]}/10)
              </label>
              <Slider
                value={moodBefore}
                onValueChange={setMoodBefore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="text-center">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-mono text-red-500">
                    🔴 {formatDuration(recordingDuration)}
                  </div>
                  <Button 
                    onClick={stopRecording}
                    size="lg" 
                    variant="destructive"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                </div>
              )}
            </div>

            {audioUrl && (
              <div className="text-center space-y-4">
                <audio controls src={audioUrl} className="w-full" />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How do you feel now? {getMoodEmoji(moodAfter[0])} ({moodAfter[0]}/10)
                  </label>
                  <Slider
                    value={moodAfter}
                    onValueChange={setMoodAfter}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Recent Sessions
          </h2>
          
          {sessions?.map((session) => (
            <Card key={session.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {session.session_type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatDuration(session.duration)} • 
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Mood Change</div>
                    <div className="text-lg">
                      {getMoodEmoji(session.mood_before || 5)} → {getMoodEmoji(session.mood_after || 5)}
                    </div>
                  </div>
                </div>
                
                {session.ai_response && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">🌸 Dr. Chetna's Response:</h4>
                    <p className="text-sm">{session.ai_response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoiceTherapy;
