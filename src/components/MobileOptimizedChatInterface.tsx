
import React, { useState, useRef, useEffect } from "react";
import { Send, LogIn, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./MessageBubble";
import { getResponse } from "@/utils/chatResponses";
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
          title: "Chat cleared",
          description: "Your chat session has been automatically cleared for privacy",
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
          title: "Chetna_AI connected",
          description: "AI assistant is now active",
        });
      } catch (error) {
        console.error("Failed to connect to Chetna_AI:", error);
        toast({
          title: "Using basic responses",
          description: "AI model couldn't be loaded",
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
      console.log("No user logged in, skipping database save");
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
        title: "Message limit reached",
        description: "Please sign up to continue",
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
        getResponse, 
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
          text: getResponse(userMessage.text),
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

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-chetna-dark/50 rounded-lg shadow-lg overflow-hidden border border-chetna-primary/10 dark:border-chetna-primary/30 mx-2 mb-20">
      {/* Mobile-optimized chat header */}
      <div className="flex justify-between items-center p-3 border-b border-chetna-primary/10 dark:border-chetna-primary/30 bg-gradient-to-r from-chetna-primary/5 to-chetna-accent/5 shrink-0">
        <h3 className="font-semibold text-chetna-primary dark:text-chetna-primary text-sm">
          {t('chat.title')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-chetna-primary/70 hover:text-chetna-primary hover:bg-chetna-primary/10 text-xs h-7 px-2"
        >
          {t('chat.clearChat')}
        </Button>
      </div>

      {/* Messages container optimized for mobile */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-white/80 dark:bg-chetna-darker/80 touch-pan-y">
        {loadingModel && (
          <div className="bg-amber-100 dark:bg-amber-900/50 rounded-lg p-2 text-xs text-center">
            {t('chat.connecting')}
          </div>
        )}
        
        {!modelLoaded && !loadingModel && (
          <div className="bg-orange-100 dark:bg-orange-900/50 rounded-lg p-2 text-xs text-center text-orange-800 dark:text-orange-100">
            {t('chat.basicMode')}
          </div>
        )}

        {!user && !showLoginPrompt && messageCount > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2 text-xs text-center text-blue-800 dark:text-blue-100">
            {t('chat.messageLimit', { current: messageCount, max: 5 })}
          </div>
        )}
        
        {showLoginPrompt && !user && (
          <div className="bg-red-100 dark:bg-red-900/50 rounded-lg p-3 text-center flex flex-col items-center gap-2 text-red-800 dark:text-red-100">
            <p className="font-medium text-sm">{t('chat.limitReached')}</p>
            <p className="text-xs">{t('chat.signupPrompt')}</p>
            <Button onClick={goToSignup} className="bg-chetna-primary hover:bg-chetna-primary/90 text-xs h-8">
              <LogIn className="h-3 w-3 mr-1" />
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
          />
        ))}
        
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs">
              C
            </div>
            <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/30 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="breathing-dot delay-0"></div>
              <div className="breathing-dot" style={{ animationDelay: "0.3s" }}></div>
              <div className="breathing-dot" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Mobile-optimized input area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-chetna-primary/10 dark:border-chetna-primary/30 bg-chetna-bubble/50 dark:bg-chetna-dark/70 shrink-0">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={showLoginPrompt && !user ? t('chat.placeholderSignup') : isTyping ? t('chat.placeholderTyping') : t('chat.placeholder')}
            className="rounded-full bg-white dark:bg-chetna-darker/80 border-none focus-visible:ring-chetna-primary text-foreground dark:text-white/90 shadow-sm text-sm h-10"
            disabled={isTyping || (showLoginPrompt && !user)}
          />

          {speechSupported && (
            <Button 
              type="button" 
              size="icon" 
              className={`rounded-full w-10 h-10 shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600 mic-pulse' : 'bg-chetna-accent hover:bg-chetna-accent/90'}`}
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
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90 w-10 h-10 shrink-0"
              onClick={goToSignup}
            >
              <LogIn className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90 w-10 h-10 shrink-0"
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

export default MobileOptimizedChatInterface;
