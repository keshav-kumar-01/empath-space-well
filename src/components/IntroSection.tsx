
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Shield, Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface IntroSectionProps {
  onStartChat: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  
  return (
    <div className="text-center space-y-8 py-8 animate-fade-in">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-chetna-primary/20 to-chetna-peach/50 dark:from-chetna-primary/30 dark:to-chetna-primary/10 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-500 shadow-md">
          <Heart className="w-10 h-10 text-chetna-primary" fill="#7C65E1" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
        {user ? `Welcome back, ${user.name}!` : "Your Mental Wellness Companion"}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        {user 
          ? "Continue your journey toward better mental health with Chetna_Ai. I'm here to listen and support you."
          : "Chetna_Ai is here to provide compassionate support for your mental health journey. Share your thoughts and feelings in a safe, judgment-free space."
        }
      </p>
      
      <div className="pt-6">
        <Button 
          size="lg" 
          onClick={onStartChat}
          className="rounded-full px-8 py-6 text-lg chetna-button transform hover:scale-105 transition-all duration-300"
        >
          Start Chatting <MessageSquare className="ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <div className="feature-card p-6 bg-gradient-to-b from-white to-chetna-peach/20 dark:from-chetna-dark dark:to-chetna-primary/5">
          <div className="w-12 h-12 mx-auto mb-4 bg-chetna-primary/10 dark:bg-chetna-primary/20 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-chetna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-chetna-dark dark:text-white">Compassionate Listening</h3>
          <p className="text-muted-foreground">A supportive space to express your feelings without judgment.</p>
        </div>
        
        <div className="feature-card p-6 bg-gradient-to-b from-white to-chetna-peach/20 dark:from-chetna-dark dark:to-chetna-primary/5">
          <div className="w-12 h-12 mx-auto mb-4 bg-chetna-primary/10 dark:bg-chetna-primary/20 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-chetna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-chetna-dark dark:text-white">Emotional Support</h3>
          <p className="text-muted-foreground">Guidance to help you navigate challenging emotions and situations.</p>
        </div>
        
        <div className="feature-card p-6 bg-gradient-to-b from-white to-chetna-peach/20 dark:from-chetna-dark dark:to-chetna-primary/5">
          <div className="w-12 h-12 mx-auto mb-4 bg-chetna-primary/10 dark:bg-chetna-primary/20 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-chetna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-chetna-dark dark:text-white">Personal Growth</h3>
          <p className="text-muted-foreground">Insights to foster self-awareness and emotional well-being.</p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
