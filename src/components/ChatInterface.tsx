
import React, { useState, useRef, useEffect } from "react";
import { Send, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./MessageBubble";
import { getResponse } from "@/utils/chatResponses";
import { initModel, getAIResponse } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Chetna, your mental wellness companion. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize the AI model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingModel(true);
        await initModel();
        setModelLoaded(true);
        toast({
          title: "Mistral AI connected",
          description: "Advanced mental health AI assistant is now active",
        });
      } catch (error) {
        console.error("Failed to connect to Mistral AI:", error);
        toast({
          title: "Using basic responses",
          description: "AI model couldn't be loaded, using fallback mode",
          variant: "destructive",
        });
      } finally {
        setLoadingModel(false);
      }
    };
    
    loadModel();
  }, [toast]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reset message count when user logs in
  useEffect(() => {
    if (user) {
      setShowLoginPrompt(false);
    }
  }, [user]);

  // Save message to database
  const saveMessageToDatabase = async (text: string, isUser: boolean) => {
    if (!user || !user.id) {
      console.log("No user logged in, skipping database save");
      return;
    }
    
    try {
      console.log("Saving message to database for user:", user.id);
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Check if user has reached the message limit and is not logged in
    if (!user && messageCount >= 5) {
      setShowLoginPrompt(true);
      toast({
        title: "Message limit reached",
        description: "Please sign up to continue chatting with Chetna",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Increment message count for non-logged in users
    if (!user) {
      setMessageCount(prevCount => prevCount + 1);
    }
    
    // Save user message to database
    await saveMessageToDatabase(userMessage.text, true);
    
    try {
      // Get AI response with fallback to predefined responses
      const aiResponseText = await getAIResponse(userMessage.text, getResponse);
      
      // Add a small variable delay to simulate more natural conversation timing
      const responseTime = Math.max(800, Math.min(2000, aiResponseText.length * 20));
      
      setTimeout(() => {
        const aiResponse: Message = {
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        
        // Save AI response to database
        saveMessageToDatabase(aiResponse.text, false);
      }, responseTime);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Use fallback response in case of error
      setTimeout(() => {
        const aiResponse: Message = {
          text: getResponse(userMessage.text),
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        
        // Save AI response to database
        saveMessageToDatabase(aiResponse.text, false);
        
        // Notify user about the error
        toast({
          title: "Using fallback response",
          description: "There was an issue with the AI model",
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

  return (
    <div className="chat-container">
      <div className="message-container">
        {loadingModel && (
          <div className="bg-amber-100 dark:bg-amber-900 rounded-lg p-2 mb-2 text-sm text-center">
            Connecting to Mistral AI...
          </div>
        )}
        
        {!modelLoaded && !loadingModel && (
          <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-2 mb-2 text-sm text-center">
            Using basic response mode. Some features may be limited.
          </div>
        )}
        
        {!user && !showLoginPrompt && messageCount > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 mb-2 text-sm text-center">
            Message {messageCount}/5 - Sign up to continue chatting after limit is reached
          </div>
        )}
        
        {showLoginPrompt && !user && (
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 mb-2 text-center flex flex-col items-center gap-3">
            <p className="font-medium">You've reached the message limit</p>
            <p className="text-sm">Please sign up to continue chatting with Chetna</p>
            <Button onClick={goToSignup} className="bg-chetna-primary hover:bg-chetna-primary/90">
              <LogIn className="h-4 w-4 mr-2" />
              Sign up now
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
            <div className="w-8 h-8 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold">
              C
            </div>
            <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/20 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="breathing-dot delay-0"></div>
              <div className="breathing-dot" style={{ animationDelay: "0.3s" }}></div>
              <div className="breathing-dot" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={showLoginPrompt && !user ? "Sign up to continue chatting..." : isTyping ? "Chetna is typing..." : "Type your message here..."}
            className="rounded-full bg-chetna-bubble dark:bg-chetna-dark/40 border-none focus-visible:ring-chetna-primary text-foreground dark:text-white"
            disabled={isTyping || (showLoginPrompt && !user)}
          />
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
