
import React, { useState, useRef, useEffect } from "react";
import { Send, LogIn, Mic, MicOff, Volume2, VolumeX, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import MessageBubble from "./MessageBubble";
import { getTranslatedResponse } from "@/utils/translatedChatResponses";
import { initModel, getAIResponse } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import speechRecognition from "@/utils/speechRecognition";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CHAT_STORAGE_KEY = 'chetna_chat_messages';
const AUTO_CLEAR_INTERVAL = 20 * 60 * 1000; // 20 minutes

const MobileOptimizedChatInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const getInitialMessages = (): Message[] => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
    }
    
    return [{
      text: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date()
    }];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => {
    try {
      return localStorage.getItem('chetna_autoplay') === 'true';
    } catch {
      return false;
    }
  });
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    try {
      return parseFloat(localStorage.getItem('chetna_playback_speed') || '0.85');
    } catch {
      return 0.85;
    }
  });
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('chetna_muted') === 'true';
    } catch {
      return false;
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoClearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-clear chat every 20 minutes
  useEffect(() => {
    const startAutoClearTimer = () => {
      if (autoClearTimerRef.current) {
        clearInterval(autoClearTimerRef.current);
      }
      
      autoClearTimerRef.current = setInterval(() => {
        clearChat();
        toast({
          title: "🔄 " + t('chat.cleared'),
          description: t('chat.clearedDescription'),
        });
      }, AUTO_CLEAR_INTERVAL);
    };

    startAutoClearTimer();

    return () => {
      if (autoClearTimerRef.current) {
        clearInterval(autoClearTimerRef.current);
      }
    };
  }, [toast, t]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  // Fetch user's test results for personalization
  const { data: userTestResults } = useQuery({
    queryKey: ["user-test-results", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("psychological_test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching test results:", error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    setSpeechSupported(speechRecognition.isSupported());
  }, []);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingModel(true);
        await initModel();
        setModelLoaded(true);
        toast({
          title: "🤖 " + t('chat.connecting.success'),
          description: t('chat.connecting.successDescription'),
        });
      } catch (error) {
        console.error("Failed to connect to Chetna_AI:", error);
        toast({
          title: "📱 " + t('chat.connecting.fallback'),
          description: t('chat.connecting.fallbackDescription'),
          variant: "destructive",
        });
      } finally {
        setLoadingModel(false);
      }
    };
    
    loadModel();
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) {
      setShowLoginPrompt(false);
    }
  }, [user]);

  const saveMessageToDatabase = async (text: string, isUser: boolean) => {
    if (!user || !user.id) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('conversations')
        .insert([
          {
            message: text,
            is_bot: !isUser,
            user_id: user.id
          }
        ]);
      
      if (error) {
        console.error("Error inserting into conversations:", error);
      }
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  };

  const clearChat = () => {
    const defaultMessage = {
      text: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date()
    };
    setMessages([defaultMessage]);
    setMessageCount(0);
    setShowLoginPrompt(false);
    
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([defaultMessage]));
    } catch (error) {
      console.error('Error clearing chat from localStorage:', error);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    if (!user && messageCount >= 5) {
      setShowLoginPrompt(true);
      toast({
        title: "📝 " + t('chat.limitReached'),
        description: t('chat.signupPrompt'),
        variant: "destructive",
      });
      return;
    }
    
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    if (!user) {
      setMessageCount(prevCount => prevCount + 1);
    }
    
    await saveMessageToDatabase(userMessage.text, true);
    
    try {
      const aiResponseText = await getAIResponse(
        userMessage.text, 
        (msg) => getTranslatedResponse(msg, t), 
        userTestResults || []
      );
      
      const responseTime = Math.max(800, Math.min(2000, aiResponseText.length * 20));
      
      setTimeout(() => {
        const aiResponse: Message = {
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        
        saveMessageToDatabase(aiResponse.text, false);
      }, responseTime);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      setTimeout(() => {
        const aiResponse: Message = {
          text: getTranslatedResponse(userMessage.text, t),
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        
        saveMessageToDatabase(aiResponse.text, false);
      }, 1000);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechRecognition.stopListening();
      setIsListening(false);
    } else {
      speechRecognition.startListening({
        onStart: () => {
          setIsListening(true);
          toast({
            title: "🎤 " + t('chat.listening'),
            description: t('chat.speakClearly'),
          });
        },
        onResult: (text) => {
          setInput(text);
          setIsListening(false);
          setTimeout(() => {
            handleSendMessage();
          }, 500);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (error) => {
          console.error("Speech recognition error:", error);
          setIsListening(false);
          toast({
            title: "🚫 " + t('chat.speechError'),
            description: error,
            variant: "destructive",
          });
        }
      });
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] h-[calc(100dvh-8rem)] bg-white dark:bg-chetna-dark/50 rounded-lg shadow-lg overflow-hidden border border-chetna-primary/10 dark:border-chetna-primary/30 mx-2 mb-20 chat-container">
      {/* Enhanced mobile-optimized chat header */}
      <div className="flex justify-between items-center p-3 border-b border-chetna-primary/10 dark:border-chetna-primary/30 bg-gradient-to-r from-chetna-primary/5 to-chetna-accent/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-chetna-primary flex items-center justify-center text-white font-bold text-sm">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-chetna-primary dark:text-chetna-primary text-sm">
              {t('chat.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {modelLoaded ? t('chat.status.aiActive') : loadingModel ? t('chat.connecting') : t('chat.basicMode')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 h-8 px-2"
                title={t('chat.speedControl')}
              >
                <Gauge className="h-4 w-4" />
                <span className="text-xs ml-1">{playbackSpeed}x</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">{t('chat.voiceSpeed')}</span>
                  <span className="text-xs text-muted-foreground">{playbackSpeed}x</span>
                </div>
                <Slider
                  value={[playbackSpeed]}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  onValueChange={(value) => {
                    const newSpeed = value[0];
                    setPlaybackSpeed(newSpeed);
                    localStorage.setItem('chetna_playback_speed', String(newSpeed));
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5x</span>
                  <span>1.5x</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newValue = !isMuted;
              setIsMuted(newValue);
              localStorage.setItem('chetna_muted', String(newValue));
              toast({
                title: newValue ? t('chat.muted') : t('chat.unmuted'),
              });
            }}
            className={`text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 h-8 w-8 p-0 ${isMuted ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
            title={isMuted ? t('chat.unmute') : t('chat.mute')}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newValue = !autoPlayEnabled;
              setAutoPlayEnabled(newValue);
              localStorage.setItem('chetna_autoplay', String(newValue));
              toast({
                title: newValue ? t('chat.autoPlayOn') : t('chat.autoPlayOff'),
                description: newValue ? t('chat.autoPlayOnDesc') : t('chat.autoPlayOffDesc'),
              });
            }}
            className={`text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 h-8 px-2 ${autoPlayEnabled ? 'bg-chetna-primary/10' : ''}`}
            title={autoPlayEnabled ? t('chat.autoPlayOn') : t('chat.autoPlayOff')}
          >
            <span className="text-xs">{autoPlayEnabled ? 'Auto' : 'Manual'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 text-xs h-8 px-2 rounded-full"
          >
            🗑️
          </Button>
        </div>
      </div>

      {/* Enhanced messages container with better mobile UX */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-white/80 dark:bg-chetna-darker/80 touch-pan-y message-container">
        {loadingModel && (
          <div className="bg-amber-50 dark:bg-amber-900/50 rounded-lg p-3 text-xs text-center border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
              <span className="text-amber-800 dark:text-amber-200">🔄 {t('chat.connecting')}</span>
            </div>
          </div>
        )}
        
        {!modelLoaded && !loadingModel && (
          <div className="bg-orange-50 dark:bg-orange-900/50 rounded-lg p-3 text-xs text-center text-orange-800 dark:text-orange-100 border border-orange-200 dark:border-orange-800">
            📱 {t('chat.basicMode')}
          </div>
        )}

        {!user && !showLoginPrompt && messageCount > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-3 text-xs text-center text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
            💬 {t('chat.messageLimit', { current: messageCount, max: 5 })}
          </div>
        )}
        
        {showLoginPrompt && !user && (
          <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 text-center flex flex-col items-center gap-3 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800">
            <div className="text-2xl">🔒</div>
            <p className="font-medium text-sm">{t('chat.limitReached')}</p>
            <p className="text-xs">{t('chat.signupPrompt')}</p>
            <Button onClick={goToSignup} className="bg-chetna-primary hover:bg-chetna-primary/90 text-xs h-10 px-6 rounded-full mobile-button">
              <LogIn className="h-4 w-4 mr-2" />
              {t('chat.signupNow')}
            </Button>
          </div>
        )}
        
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
            autoPlay={autoPlayEnabled}
            isLatest={index === messages.length - 1 && !isTyping}
            playbackSpeed={playbackSpeed}
            isMuted={isMuted}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs">
              🤖
            </div>
            <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/30 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
              <div className="breathing-dot delay-0"></div>
              <div className="breathing-dot" style={{ animationDelay: "0.3s" }}></div>
              <div className="breathing-dot" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Enhanced mobile-optimized input area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-chetna-primary/10 dark:border-chetna-primary/30 bg-chetna-bubble/50 dark:bg-chetna-dark/70 shrink-0">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={showLoginPrompt && !user ? t('chat.placeholderSignup') : isTyping ? t('chat.placeholderTyping') : t('chat.placeholder')}
            className="rounded-full bg-white dark:bg-chetna-darker/80 border-none focus-visible:ring-chetna-primary text-foreground dark:text-white/90 shadow-sm text-sm h-12 px-4 mobile-button"
            disabled={isTyping || (showLoginPrompt && !user)}
            style={{ fontSize: '16px' }} // Prevent zoom on iOS
          />

          {speechSupported && (
            <Button 
              type="button" 
              size="icon" 
              className={`rounded-full w-12 h-12 shrink-0 mobile-button ${isListening ? 'bg-red-500 hover:bg-red-600 mic-pulse' : 'bg-chetna-accent hover:bg-chetna-accent/90'}`}
              onClick={toggleSpeechRecognition}
              disabled={(showLoginPrompt && !user) || isTyping}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          
          {showLoginPrompt && !user ? (
            <Button 
              type="button" 
              size="icon" 
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90 w-12 h-12 shrink-0 mobile-button"
              onClick={goToSignup}
            >
              <LogIn className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90 w-12 h-12 shrink-0 mobile-button shadow-lg"
              disabled={!input.trim() || isTyping || (showLoginPrompt && !user)}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MobileOptimizedChatInterface;
