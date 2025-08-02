
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SimpleSubscriptionGuard from '@/components/SimpleSubscriptionGuard';
import { useSimpleSubscription } from '@/hooks/useSimpleSubscription';
import { getAIResponse, initModel } from '@/services/aiService';
import { getResponse } from '@/utils/chatResponses';
import MessageBubble from '@/components/MessageBubble';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Dr. Chetna Sharma, your mental wellness companion. How are you feeling today? 😊',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiInitialized, setAiInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { incrementUsage } = useSimpleSubscription();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize AI model on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initModel();
        setAiInitialized(true);
        console.log('AI model initialized successfully');
      } catch (error) {
        console.error('Failed to initialize AI model:', error);
        setAiInitialized(false);
      }
    };
    
    initialize();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from('conversations').insert({
        user_id: user.id,
        message: userMessage.content,
        is_bot: false,
      });

      // Increment AI conversation usage
      incrementUsage('aiConversations');

      // Get bot response using AI service with fallback
      let botResponseContent: string;
      
      if (aiInitialized) {
        // Try to get AI response first
        botResponseContent = await getAIResponse(
          userMessage.content,
          getResponse, // Fallback function
        );
      } else {
        // Use fallback response system
        botResponseContent = getResponse(userMessage.content);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseContent,
        isBot: true,
        timestamp: new Date(),
      };

      // Save bot message to database
      await supabase.from('conversations').insert({
        user_id: user.id,
        message: botMessage.content,
        is_bot: true,
      });

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <SimpleSubscriptionGuard usageType="aiConversations">
      <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              isUser={!message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 bg-chetna-primary rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="bg-white border-chetna-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Dr. Chetna is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-white border-t rounded-b-lg">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {!aiInitialized && (
            <p className="text-xs text-gray-500 mt-2">
              Using fallback responses (AI service unavailable)
            </p>
          )}
        </div>
      </div>
    </SimpleSubscriptionGuard>
  );
};

export default ChatInterface;
