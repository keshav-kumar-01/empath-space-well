
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { chatResponses } from '@/utils/chatResponses';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionGuard from '@/components/SubscriptionGuard';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, updateUsage, getRemainingUsage } = useSubscription();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: "Hello! I'm your AI mental health companion. I'm here to listen, support, and provide guidance. How are you feeling today?",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a conversation.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has reached AI conversation limit
    if (hasReachedLimit('ai_conversations')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your monthly AI conversation limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from('conversations').insert({
        user_id: user.id,
        message: inputValue,
        is_bot: false,
      });

      // Get AI response
      const aiResponse = chatResponses.getResponse(inputValue);
      
      // Simulate AI thinking time
      setTimeout(async () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        // Save AI response to database
        await supabase.from('conversations').insert({
          user_id: user.id,
          message: aiResponse,
          is_bot: true,
        });

        // Update usage count
        updateUsage({ type: 'ai_conversations' });
        
        setIsLoading(false);
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const remaining = getRemainingUsage('ai_conversations');

  return (
    <SubscriptionGuard 
      usageType="ai_conversations"
      fallbackTitle="AI Conversation Limit Reached"
      fallbackDescription="You've used all your AI conversations for this month. Upgrade to continue chatting with our AI companion."
    >
      <Card className="h-[600px] flex flex-col bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chetna-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-chetna-dark">AI Mental Health Companion</h3>
              <p className="text-sm text-gray-600">Always here to listen and support</p>
            </div>
          </div>
          {remaining !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Conversations remaining</p>
              <p className="text-sm font-semibold text-chetna-primary">{remaining}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                {message.isBot && (
                  <div className="w-8 h-8 bg-chetna-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-chetna-primary text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 bg-chetna-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-chetna-primary rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border-gray-300 focus:border-chetna-primary"
              disabled={isLoading || hasReachedLimit('ai_conversations')}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || hasReachedLimit('ai_conversations')}
              className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </SubscriptionGuard>
  );
};

export default ChatInterface;
