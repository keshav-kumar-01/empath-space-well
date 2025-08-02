
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
      content: 'Hello! I\'m here to support your mental health journey. How are you feeling today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      // Generate bot response (simplified for now)
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
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

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "I understand how you're feeling. It's important to acknowledge these emotions.",
      "Thank you for sharing that with me. How has this been affecting your daily life?",
      "That sounds challenging. What coping strategies have you tried before?",
      "I hear you. Remember that seeking help is a sign of strength, not weakness.",
      "It's completely normal to feel this way. What would make you feel more supported right now?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isBot ? '' : 'justify-end'
              }`}
            >
              {message.isBot && (
                <div className="flex-shrink-0 w-8 h-8 bg-chetna-primary rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <Card
                className={`max-w-xs lg:max-w-md ${
                  message.isBot
                    ? 'bg-white border-chetna-primary/20'
                    : 'bg-chetna-primary text-white border-0'
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
              {!message.isBot && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
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
                    <span className="text-sm">Typing...</span>
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
              placeholder="Type your message here..."
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
        </div>
      </div>
    </SimpleSubscriptionGuard>
  );
};

export default ChatInterface;
