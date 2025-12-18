import React, { useState, useRef } from "react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { Volume2, Pause, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Audio waveform animation component
const AudioWaveform: React.FC = () => (
  <div className="flex items-center gap-0.5 h-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-0.5 bg-chetna-primary rounded-full"
        style={{
          height: '100%',
          animation: `waveform 0.8s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes waveform {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  autoPlay?: boolean;
  isLatest?: boolean;
  playbackSpeed?: number;
  isMuted?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, timestamp, autoPlay = false, isLatest = false, playbackSpeed = 0.85, isMuted = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoPlayed = useRef(false);

  // Apply muted state to audio
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Auto-play for latest AI message (skip if muted)
  React.useEffect(() => {
    if (autoPlay && isLatest && !isUser && !hasAutoPlayed.current && !isMuted) {
      hasAutoPlayed.current = true;
      playTTS();
    }
  }, [autoPlay, isLatest, isUser]);

  const playTTS = async () => {
    if (isPaused && audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://fqqnbpgoqtnrzjgzllja.supabase.co/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcW5icGdvcXRucnpqZ3psbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDg4NTQsImV4cCI6MjA1OTU4NDg1NH0.7pNJ3hmrED_BM1qB9Z-_KNYPdjAnnRm4cpQYWeEXlTk",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcW5icGdvcXRucnpqZ3psbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDg4NTQsImV4cCI6MjA1OTU4NDg1NH0.7pNJ3hmrED_BM1qB9Z-_KNYPdjAnnRm4cpQYWeEXlTk`,
          },
          body: JSON.stringify({ text: message, speed: playbackSpeed }),
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (isUser) {
    return (
      <div className="flex items-end gap-2 justify-end">
        <div className="bg-chetna-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-soft">
          <p className="text-sm leading-relaxed break-words">{message}</p>
          <div className="text-xs text-white/80 mt-1">
            {format(timestamp, "HH:mm")}
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs shrink-0">
          You
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-6 h-6 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs shrink-0">
        C
      </div>
      <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/30 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-soft">
        <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 prose prose-sm max-w-none break-words">
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="font-bold text-chetna-primary dark:text-chetna-primary">{children}</strong>
              ),
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-1 my-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start">
                  <span className="text-chetna-primary mr-2 mt-1">•</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {format(timestamp, "HH:mm")}
          </div>
          <div className="flex items-center gap-1">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-chetna-primary" />
            ) : isPlaying ? (
              <>
                <AudioWaveform />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-chetna-primary hover:bg-chetna-primary/10"
                  onClick={pauseTTS}
                >
                  <Pause className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-chetna-primary hover:bg-chetna-primary/10"
                  onClick={stopTTS}
                >
                  <Square className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-chetna-primary hover:bg-chetna-primary/10"
                onClick={playTTS}
                title={isPaused ? "Resume" : "Listen"}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
