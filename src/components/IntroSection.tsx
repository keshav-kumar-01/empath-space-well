
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface IntroSectionProps {
  onStartChat: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  
  return (
    <div className="text-center space-y-8 py-8 animate-fade-in">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-chetna-primary/10 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-chetna-primary" fill="#7C65E1" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold">
        {user ? `Welcome back, ${user.name}!` : "Your Mental Wellness Companion"}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        {user 
          ? "Continue your journey toward better mental health with Chetna_Ai. I'm here to listen and support you."
          : "Chetna_Ai is here to provide compassionate support for your mental health journey. Share your thoughts and feelings in a safe, judgment-free space."
        }
      </p>
      
      <div className="pt-4">
        <Button 
          size="lg" 
          onClick={onStartChat}
          className="rounded-full px-8 py-6 text-lg chetna-button bg-chetna-primary hover:bg-chetna-primary/90"
        >
          Start Chatting <MessageSquare className="ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-2">Compassionate Listening</h3>
          <p className="text-muted-foreground">A supportive space to express your feelings without judgment.</p>
        </div>
        
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-2">Emotional Support</h3>
          <p className="text-muted-foreground">Guidance to help you navigate challenging emotions and situations.</p>
        </div>
        
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-2">Personal Growth</h3>
          <p className="text-muted-foreground">Insights to foster self-awareness and emotional well-being.</p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
