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

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-chetna-primary" />,
      title: t('features.moodTracking.title'),
      description: t('features.moodTracking.description'),
      path: "/mood-tracker"
    },
    {
      icon: <Calendar className="h-8 w-8 text-chetna-primary" />,
      title: t('features.appointments.title'),
      description: t('features.appointments.description'),
      path: "/appointments"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-chetna-primary" />,
      title: t('features.resources.title'),
      description: t('features.resources.description'),
      path: "/resources"
    },
    {
      icon: <Users className="h-8 w-8 text-chetna-primary" />,
      title: t('features.community.title'),
      description: t('features.community.description'),
      path: "/community"
    },
    {
      icon: <Shield className="h-8 w-8 text-chetna-primary" />,
      title: t('features.crisis.title'),
      description: t('features.crisis.description'),
      path: "/crisis-support"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <BackgroundElements />
      <Header />
      
      <main className="relative z-10">
        <IntroSection />
        
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
        <section className="py-16 px-4 sm:px-6 lg:px-8">
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
