
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Heart, Calendar, BookOpen, Users, Shield, MessageCircle, Brain, Sparkles } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import CustomerServiceBot from "@/components/CustomerServiceBot";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import FeatureCard from "@/components/FeatureCard";
import ReviewsSection from "@/components/ReviewsSection";
import BackgroundElements from "@/components/BackgroundElements";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
    // Scroll to chat section
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Heart,
      title: t('features.moodTracking.title'),
      description: t('features.moodTracking.description'),
      path: "/mood-tracker",
      iconColor: "text-chetna-primary",
      backgroundGradient: "bg-gradient-to-br from-chetna-primary/20 to-chetna-primary/30"
    },
    {
      icon: Calendar,
      title: t('features.appointments.title'),
      description: t('features.appointments.description'),
      path: "/appointments",
      iconColor: "text-chetna-secondary",
      backgroundGradient: "bg-gradient-to-br from-chetna-secondary/20 to-chetna-secondary/30"
    },
    {
      icon: BookOpen,
      title: t('features.resources.title'),
      description: t('features.resources.description'),
      path: "/resources",
      iconColor: "text-chetna-accent",
      backgroundGradient: "bg-gradient-to-br from-chetna-accent/20 to-chetna-accent/30"
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      path: "/community",
      iconColor: "text-blue-600",
      backgroundGradient: "bg-gradient-to-br from-blue-500/20 to-blue-600/30"
    },
    {
      icon: Shield,
      title: t('features.crisis.title'),
      description: t('features.crisis.description'),
      path: "/crisis-support",
      iconColor: "text-red-600",
      backgroundGradient: "bg-gradient-to-br from-red-500/20 to-red-600/30"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <BackgroundElements />
      <Header />
      
      <main className="relative z-10">
        <IntroSection onStartChat={handleStartChat} />
        
        {/* AI Features Highlight Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                ✨ NEW AI-POWERED FEATURES
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Advanced AI Mental Health Tools
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover our cutting-edge AI features designed to provide personalized mental health support, 
                from dream analysis to voice therapy sessions.
              </p>
              <Link to="/ai-features">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                >
                  <Brain className="mr-2 h-6 w-6" />
                  Explore AI Features
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Quick Feature Preview */}
            <div className="grid md:grid-cols-4 gap-4 mt-12">
              <Card className="hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Wellness Plans</h3>
                  <p className="text-sm text-gray-600">AI-generated daily routines</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Voice Therapy</h3>
                  <p className="text-sm text-gray-600">AI voice conversations</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Dream Analysis</h3>
                  <p className="text-sm text-gray-600">AI dream interpretation</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">More Features</h3>
                  <p className="text-sm text-gray-600">Emotion recognition & more</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Existing Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Chat Interface */}
        <section id="chat-section" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('chat.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('chat.subtitle')}
              </p>
            </div>
            <ChatInterface />
          </div>
        </section>

        <ReviewsSection />
        <CustomerServiceBot />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
