
import React from "react";
import { useTranslation } from "react-i18next";
import { Heart, Shield, Clock, Users, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface IntroSectionProps {
  onStartChat: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartChat }) => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "AI companion trained in compassionate communication for mental wellness"
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are confidential and protected"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get support whenever you need it, day or night"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar wellness journeys"
    }
  ];

  return (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-chetna-primary/10 to-chetna-accent/10 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-chetna-primary" />
          <span className="text-sm font-medium text-chetna-primary">AI-Powered Mental Wellness</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent">
            {t('hero.title')}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onStartChat}
            size="lg"
            className="chetna-button text-lg px-8 py-6 bg-gradient-to-r from-chetna-primary to-chetna-accent hover:from-chetna-accent hover:to-chetna-primary transform hover:scale-105 transition-all duration-300 shadow-glow"
          >
            <Brain className="mr-2 h-5 w-5" />
            {t('hero.startChat')}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-6 border-2 border-chetna-primary/20 hover:border-chetna-primary/40 hover:bg-chetna-primary/5"
          >
            {t('hero.learnMore')}
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="feature-card border-chetna-primary/10 hover:shadow-glow hover:border-chetna-primary/30 transition-all duration-500 group"
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-chetna-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-chetna-dark dark:text-white">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntroSection;
