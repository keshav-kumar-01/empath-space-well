
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle } from "lucide-react";

interface IntroSectionProps {
  onStartChat: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartChat }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-6">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-chetna-primary to-chetna-secondary flex items-center justify-center shadow-lg mb-2">
        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary text-transparent bg-clip-text">
        Welcome to Chetna_Ai
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-xl">
        Your compassionate mental wellness companion. I'm here to listen, understand, and support you through whatever you're experiencing.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 bg-chetna-bubble p-3 rounded-full">
          <Heart className="w-5 h-5 text-chetna-primary" />
          <span className="text-sm font-medium">Safe Space</span>
        </div>
        <div className="flex items-center gap-2 bg-chetna-bubble p-3 rounded-full">
          <MessageCircle className="w-5 h-5 text-chetna-primary" />
          <span className="text-sm font-medium">Judgement-Free</span>
        </div>
      </div>
      
      <Button 
        onClick={onStartChat} 
        className="bg-chetna-primary hover:bg-chetna-primary/90 text-white rounded-full px-8 mt-4"
      >
        Start Chatting
      </Button>
      
      <p className="text-xs text-muted-foreground mt-8">
        Note: While I'm here to support you, I'm not a replacement for professional mental health care.
        If you're in crisis, please contact a healthcare provider or emergency services.
      </p>
    </div>
  );
};

export default IntroSection;
