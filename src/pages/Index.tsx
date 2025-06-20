
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Heart, Calendar, BookOpen, Users, Shield, MessageCircle } from "lucide-react";
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

        {/* Features Section */}
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
