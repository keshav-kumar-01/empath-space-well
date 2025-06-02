
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Shield, Brain, Star, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface IntroSectionProps {
  onStartChat: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  
  return (
    <div className="text-center space-y-12 py-12 animate-fade-in-up relative">
      {/* Main heart icon with enhanced styling */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-chetna-primary/20 via-chetna-peach/30 to-chetna-primary/10 dark:from-chetna-primary/30 dark:to-chetna-primary/15 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-700 shadow-soft hover:shadow-glow animate-bounce-gentle">
          <Heart className="w-12 h-12 text-chetna-primary drop-shadow-lg" fill="#7C65E1" />
          <Sparkles className="w-4 h-4 text-chetna-accent absolute top-2 right-2 animate-pulse" />
        </div>
      </div>
      
      {/* Main heading with enhanced gradient */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
          {user ? `Welcome back, ${user.name}!` : "Your Mental Wellness Companion"}
        </h1>
        
        <div className="w-32 h-1 bg-gradient-to-r from-chetna-primary to-chetna-accent mx-auto rounded-full shadow-glow"></div>
      </div>
      
      {/* Description with improved typography */}
      <p className="text-xl md:text-2xl text-muted-foreground dark:text-white/85 max-w-3xl mx-auto leading-relaxed font-medium">
        {user 
          ? "Continue your journey toward better mental health with Chetna_AI. I'm here to listen and support you with personalized care."
          : "Chetna_AI provides compassionate, AI-powered support for your mental health journey. Share your thoughts and feelings in a safe, judgment-free space."
        }
      </p>
      
      {/* Enhanced action buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
        <Button 
          size="lg" 
          onClick={onStartChat}
          className="rounded-full px-10 py-6 text-xl chetna-button transform hover:scale-105 transition-all duration-500 shadow-soft hover:shadow-glow"
        >
          Start Chatting 
          <MessageSquare className="ml-3 h-5 w-5" />
          <Sparkles className="ml-1 h-4 w-4 animate-pulse" />
        </Button>
        
        <Link to="/quiz">
          <Button 
            size="lg"
            variant="outline" 
            className="rounded-full px-10 py-6 text-xl border-2 border-chetna-primary/30 text-chetna-primary hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 transform hover:scale-105 transition-all duration-500 backdrop-blur-sm bg-white/20 dark:bg-chetna-dark/20 shadow-soft hover:shadow-glow"
          >
            Chetna Quest 
            <Brain className="ml-3 h-5 w-5" />
            <Star className="ml-1 h-4 w-4 animate-pulse" />
          </Button>
        </Link>
      </div>
      
      {/* Enhanced feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
        <div className="feature-card p-8 group hover:scale-105 transition-all duration-500">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-chetna-primary/20 to-chetna-primary/30 dark:from-chetna-primary/30 dark:to-chetna-primary/40 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-inner-glow">
            <Heart className="h-8 w-8 text-chetna-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-chetna-dark dark:text-white">Compassionate Listening</h3>
          <p className="text-muted-foreground dark:text-white/75 text-lg leading-relaxed">A supportive space to express your feelings without judgment, with AI that truly understands.</p>
        </div>
        
        <div className="feature-card p-8 group hover:scale-105 transition-all duration-500">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-chetna-secondary/20 to-chetna-secondary/30 dark:from-chetna-secondary/30 dark:to-chetna-secondary/40 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-inner-glow">
            <Shield className="h-8 w-8 text-chetna-secondary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-chetna-dark dark:text-white">Emotional Support</h3>
          <p className="text-muted-foreground dark:text-white/75 text-lg leading-relaxed">Personalized guidance to help you navigate challenging emotions and difficult situations.</p>
        </div>
        
        <div className="feature-card p-8 group hover:scale-105 transition-all duration-500">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-chetna-accent/20 to-chetna-accent/30 dark:from-chetna-accent/30 dark:to-chetna-accent/40 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-inner-glow">
            <Brain className="h-8 w-8 text-chetna-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-chetna-dark dark:text-white">Personal Growth</h3>
          <p className="text-muted-foreground dark:text-white/75 text-lg leading-relaxed">Evidence-based insights to foster self-awareness and sustainable emotional well-being.</p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
