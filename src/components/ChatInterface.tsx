import React, { useState, useRef, useEffect } from "react";
import { Send, LogIn, Mic, MicOff, Volume2, VolumeX, Gauge } from "lucide-react";
import FollowUpSuggestions, { generateFollowUps } from "./FollowUpSuggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import MessageBubble from "./MessageBubble";
import { getTranslatedResponse } from "@/utils/translatedChatResponses";
import { useTranslation } from "react-i18next";
import { initModel, getAIResponse } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import speechRecognition from "@/utils/speechRecognition";
import { useQuery } from "@tanstack/react-query";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CHAT_STORAGE_KEY = 'chetna_chat_messages';
const AUTO_CLEAR_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds

const ChatInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const getInitialMessages = (): Message[] => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
    }
    
    // Default welcome message
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
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
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
        console.log('Auto-clearing chat after 20 minutes');
        clearChat();
      toast({
        title: t('chat.cleared'),
        description: t('chat.clearedDescription'),
      });
      }, AUTO_CLEAR_INTERVAL);
    };

    startAutoClearTimer();

    // Cleanup on unmount
    return () => {
      if (autoClearTimerRef.current) {
        clearInterval(autoClearTimerRef.current);
      }
    };
  }, [toast, t]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  // Fetch user's psychological test results for personalization
  const { data: userTestResults } = useQuery({
    queryKey: ["user-test-results", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("psychological_test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5); // Get latest 5 test results for context
        
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
          title: t('chat.connecting.success'),
          description: t('chat.connecting.successDescription'),
        });
      } catch (error) {
        console.error("Failed to connect to Chetna_AI:", error);
        toast({
          title: t('chat.connecting.fallback'),
          description: t('chat.connecting.fallbackDescription'),
          variant: "destructive",
        });
      } finally {
        setLoadingModel(false);
      }
    };
    
    loadModel();
  }, [toast]);

  // Update welcome message when user test results are loaded or language changes
  useEffect(() => {
    if (user && userTestResults && userTestResults.length > 0) {
      const hasTestResults = userTestResults.length > 0;
      if (hasTestResults && messages.length === 1) {
        // Only update if we still have the default welcome message
        const newWelcomeMessage = {
          text: t('chat.personalizedWelcome', { name: user.name }),
          isUser: false,
          timestamp: new Date()
        };
        setMessages([newWelcomeMessage]);
      }
    } else if (messages.length === 1) {
      // Update default message when language changes
      const updatedWelcomeMessage = {
        text: t('chat.welcomeMessage'),
        isUser: false,
        timestamp: new Date()
      };
      setMessages([updatedWelcomeMessage]);
    }
  }, [user, userTestResults, i18n.language, t]);

  // Handle language changes - clear chat and start fresh
  useEffect(() => {
    // Clear existing messages and start with new translated welcome message
    const newWelcomeMessage = {
      text: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date()
    };
    
    // Only update if it's a different language (not initial load)
    if (messages.length > 0 && messages[0].text !== newWelcomeMessage.text) {
      setMessages([newWelcomeMessage]);
      setMessageCount(0);
      setShowLoginPrompt(false);
      
      // Update localStorage
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([newWelcomeMessage]));
      } catch (error) {
        console.error('Error updating chat language in localStorage:', error);
      }
    }
  }, [i18n.language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        throw error;
      }
    } catch (error) {
      console.error("Error saving message to database:", error);
      // Silent fail - don't interrupt user experience
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
    
    // Clear from localStorage
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
        title: t('chat.limitReached'),
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
    setFollowUpSuggestions([]);
    
    if (!user) {
      setMessageCount(prevCount => prevCount + 1);
    }
    
    await saveMessageToDatabase(userMessage.text, true);
    
    try {
      // Pass user's test results to AI for personalized responses
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
        setFollowUpSuggestions(generateFollowUps(aiResponseText));
        
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
        setFollowUpSuggestions(generateFollowUps(aiResponse.text));
        
        saveMessageToDatabase(aiResponse.text, false);
        
        toast({
          title: t('chat.connecting.fallback'),
          description: t('chat.connecting.error'),
          variant: "destructive",
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const goToSignup = () => {
    navigate("/signup");
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
            title: t('chat.listening'),
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
            title: t('chat.speechError'),
            description: error,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div className="chat-container flex flex-col h-[60vh] sm:h-[65vh] md:h-[75vh] bg-white dark:bg-chetna-dark/50 rounded-xl shadow-lg overflow-hidden border border-chetna-primary/10 dark:border-chetna-primary/30 w-full max-w-full mx-auto">
      {/* Chat header with clear button, auto-play toggle, and speed control */}
      <div className="flex justify-between items-center p-3 border-b border-chetna-primary/10 dark:border-chetna-primary/30 bg-gradient-to-r from-chetna-primary/5 to-chetna-accent/5">
        <h3 className="font-semibold text-chetna-primary dark:text-chetna-primary">{t('chat.title')}</h3>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 gap-1 px-2"
                title={t('chat.speedControl')}
              >
                <Gauge className="h-4 w-4" />
                <span className="text-xs">{playbackSpeed}x</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="end">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('chat.voiceSpeed')}</span>
                  <span className="text-sm text-muted-foreground">{playbackSpeed}x</span>
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
                  <span>1.0x</span>
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
            className={`text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 ${isMuted ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
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
            className={`text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 px-2 gap-1 ${autoPlayEnabled ? 'bg-chetna-primary/10' : ''}`}
            title={autoPlayEnabled ? t('chat.autoPlayOn') : t('chat.autoPlayOff')}
          >
            <span className="text-xs">{autoPlayEnabled ? 'Auto' : 'Manual'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10"
          >
            {t('chat.clearChat')}
          </Button>
        </div>
      </div>

      <div className="message-container flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-4 bg-white/80 dark:bg-chetna-darker/80 w-full">
        {loadingModel && (
          <div className="bg-amber-100 dark:bg-amber-900/50 rounded-lg p-2 mb-2 text-sm text-center">
            {t('chat.connecting')}
          </div>
        )}
        
        {!modelLoaded && !loadingModel && (
          <div className="bg-orange-100 dark:bg-orange-900/50 rounded-lg p-2 mb-2 text-sm text-center text-orange-800 dark:text-orange-100">
            {t('chat.basicMode')}
          </div>
        )}

        {user && userTestResults && userTestResults.length > 0 && (
          <div className="bg-gradient-to-r from-chetna-primary/10 to-chetna-peach/20 dark:bg-chetna-primary/20 rounded-lg p-3 mb-2 text-sm text-center border border-chetna-primary/20">
            <p className="font-medium text-chetna-primary dark:text-chetna-primary">
              {t('chat.personalizedActive')}
            </p>
            <p className="text-xs text-chetna-primary/80 dark:text-chetna-primary/80 mt-1">
              {t(userTestResults.length === 1 ? 'chat.personalizedDescription' : 'chat.personalizedDescriptionPlural', { count: userTestResults.length })}
            </p>
          </div>
        )}
        
        {!user && !showLoginPrompt && messageCount > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2 mb-2 text-sm text-center text-blue-800 dark:text-blue-100">
            {t('chat.messageLimit', { current: messageCount, max: 5 })}
          </div>
        )}
        
        {showLoginPrompt && !user && (
          <div className="bg-red-100 dark:bg-red-900/50 rounded-lg p-4 mb-2 text-center flex flex-col items-center gap-3 text-red-800 dark:text-red-100">
            <p className="font-medium">{t('chat.limitReached')}</p>
            <p className="text-sm">{t('chat.signupPrompt')}</p>
            <Button onClick={goToSignup} className="bg-chetna-primary hover:bg-chetna-primary/90">
              <LogIn className="h-4 w-4" />
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
            <div className="w-8 h-8 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold">
              C
            </div>
            <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/30 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="breathing-dot delay-0"></div>
              <div className="breathing-dot" style={{ animationDelay: "0.3s" }}></div>
              <div className="breathing-dot" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        )}

        {/* Follow-up suggestions */}
        <FollowUpSuggestions
          suggestions={followUpSuggestions}
          isVisible={!isTyping && followUpSuggestions.length > 0}
          onSelect={(suggestion) => {
            setInput(suggestion);
            setFollowUpSuggestions([]);
            setTimeout(() => handleSendMessage(), 100);
          }}
        />
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input p-4 border-t border-chetna-primary/10 dark:border-chetna-primary/30 bg-chetna-bubble/50 dark:bg-chetna-dark/70">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={showLoginPrompt && !user ? t('chat.placeholderSignup') : isTyping ? t('chat.placeholderTyping') : t('chat.placeholder')}
            className="rounded-full bg-white dark:bg-chetna-darker/80 border-none focus-visible:ring-chetna-primary text-foreground dark:text-white/90 shadow-sm"
            disabled={isTyping || (showLoginPrompt && !user)}
          />

          {speechSupported && (
            <Button 
              type="button" 
              size="icon" 
              className={`rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600 mic-pulse' : 'bg-chetna-accent hover:bg-chetna-accent/90'}`}
              onClick={toggleSpeechRecognition}
              disabled={(showLoginPrompt && !user) || isTyping}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          {showLoginPrompt && !user ? (
            <Button 
              type="button" 
              size="icon" 
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90"
              onClick={goToSignup}
            >
              <LogIn className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90"
              disabled={!input.trim() || isTyping || (showLoginPrompt && !user)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
