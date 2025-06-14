
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CustomerServiceBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm here to help you learn about Chetna_AI. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("what") && (message.includes("chetna") || message.includes("ai"))) {
      return "Chetna_AI is your mental wellness companion - an AI-powered platform designed to provide compassionate support for anxiety, depression, stress, and other mental health challenges. We offer personalized chat support, psychological tests, community features, and mental health resources.";
    }
    
    if (message.includes("how") && message.includes("work")) {
      return "Chetna_AI works by providing you with an empathetic AI chat interface where you can express your feelings and receive supportive responses. We also offer psychological assessments, a supportive community, journaling features, and connections to mental health resources.";
    }
    
    if (message.includes("free") || message.includes("cost") || message.includes("price")) {
      return "Chetna_AI offers both free and premium features. You can start chatting with our AI for free (with some limitations for unregistered users). Sign up for full access to all features including unlimited chat, psychological tests, and community participation.";
    }
    
    if (message.includes("sign up") || message.includes("register") || message.includes("account")) {
      return "You can sign up for free by clicking the 'Sign Up' button in the top navigation. This gives you unlimited access to our AI chat, psychological tests, journaling, and community features.";
    }
    
    if (message.includes("test") || message.includes("assessment") || message.includes("quiz")) {
      return "We offer various psychological assessments including PHQ-9 (depression), GAD-7 (anxiety), Beck Anxiety Inventory, and personality quizzes. These help personalize your experience and provide insights into your mental wellness.";
    }
    
    if (message.includes("community")) {
      return "Our community feature allows you to connect with others on similar mental health journeys. You can share experiences, offer support, and participate in discussions in a safe, moderated environment.";
    }
    
    if (message.includes("privacy") || message.includes("safe") || message.includes("secure")) {
      return "Your privacy and safety are our top priorities. All conversations are confidential, and we follow strict data protection standards. Your personal information is never shared without your consent.";
    }
    
    if (message.includes("emergency") || message.includes("crisis") || message.includes("help")) {
      return "If you're experiencing a mental health emergency, please contact emergency services immediately. We also provide emergency resources and crisis hotlines through our platform. Chetna_AI is a support tool but not a replacement for professional medical care.";
    }
    
    if (message.includes("creator") || message.includes("founder") || message.includes("developer")) {
      return "Chetna_AI was created by Keshav Kumar, who serves as our CEO and Founder, with support from Anchal and Ashutosh. The platform was built with a mission to make mental health support accessible to everyone.";
    }
    
    if (message.includes("contact") || message.includes("support")) {
      return "You can reach our support team through the feedback form on our website, or connect with us through our community platform. We're here to help with any questions or concerns you may have.";
    }
    
    if (message.includes("mobile") || message.includes("app")) {
      return "Currently, Chetna_AI is available as a web application that works great on both desktop and mobile browsers. We're working on dedicated mobile apps for an even better experience.";
    }
    
    if (message.includes("language") || message.includes("hindi") || message.includes("english")) {
      return "Chetna_AI supports multiple languages including English and Hindi. You can switch languages using the language selector in the top navigation bar.";
    }
    
    // Default responses
    const defaultResponses = [
      "I'm here to help you learn about Chetna_AI! You can ask me about our features, how to get started, privacy, or anything else about our platform.",
      "Feel free to ask me about Chetna_AI's features, pricing, safety measures, or how our mental wellness platform can support you.",
      "I can help you understand what Chetna_AI offers, how to sign up, our community features, or any other questions about our platform.",
      "Ask me anything about Chetna_AI - our AI chat support, psychological tests, community features, or how we can help with your mental wellness journey!"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        text: getResponse(input),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-chetna-primary hover:bg-chetna-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl border-2 border-chetna-primary/20">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/90 text-white">
            <CardTitle className="text-sm font-medium">Chetna_AI Support</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-chetna-primary text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Chetna_AI..."
                  className="text-sm"
                />
                <Button type="submit" size="sm" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerServiceBot;
