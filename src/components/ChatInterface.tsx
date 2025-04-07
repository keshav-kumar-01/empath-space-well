
import React, { useState, useRef, useEffect } from "react";
import { Send, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./MessageBubble";
import { getResponse } from "@/utils/chatResponses";
import { initModel, getAIResponse } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if API key exists in localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('mistralApiKey');
    if (savedApiKey) {
      // No need to show dialog if we already have a key
      setApiKeyInput(savedApiKey);
    }
  }, []);

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
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveApiKey = () => {
    if (apiKeyInput) {
      localStorage.setItem('mistralApiKey', apiKeyInput);
      setApiKeyDialogOpen(false);
      toast({
        title: "API Key saved",
        description: "Your Mistral AI API key has been saved",
      });
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
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
            <div className="bg-chetna-ai-bubble p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="breathing-dot delay-0"></div>
              <div className="breathing-dot" style={{ animationDelay: "0.3s" }}></div>
              <div className="breathing-dot" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={() => setApiKeyDialogOpen(true)}
        >
          <Key className="h-3 w-3" /> Manage API Key
        </Button>
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "Chetna is typing..." : "Type your message here..."}
            className="rounded-full bg-chetna-bubble border-none focus-visible:ring-chetna-primary"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-chetna-primary hover:bg-chetna-primary/90"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mistral AI API Key</DialogTitle>
            <DialogDescription>
              Enter your Mistral AI API key for advanced mental health responses.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-y-2">
            <Input
              placeholder="Enter API key"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
