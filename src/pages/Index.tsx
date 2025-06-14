import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import ChatInterface from "@/components/ChatInterface";
import ReviewsSection from "@/components/ReviewsSection";
import CustomerServiceBot from "@/components/CustomerServiceBot";
import { MessageSquare, Users, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'community'>('chat');

  const startChat = () => {
    setShowIntro(false);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint dark:from-chetna-dark dark:to-chetna-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-chetna-primary/8 to-chetna-accent/8 rounded-full blur-2xl floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-chetna-secondary/8 to-chetna-primary/8 rounded-full blur-2xl floating" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-chetna-accent/6 to-chetna-peach/12 rounded-full blur-3xl floating" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-chetna-primary/8 to-chetna-secondary/8 rounded-full blur-2xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-chetna-mint/10 to-chetna-lavender/10 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <Helmet>
        <title>Chetna_AI - Your Mental Wellness Companion</title>
        <meta name="description" content="Experience compassionate AI support for anxiety, depression, stress, and other mental health challenges with Chetna_AI - your mental wellness companion." />
        <meta name="keywords" content="mental health AI, anxiety help, depression support, stress management, emotional wellness, mental health chat" />
        <link rel="canonical" href="https://empath-space-well.vercel.app/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center relative z-10 max-w-7xl">
        <div className="w-full">
          {showIntro ? (
            <>
              <IntroSection onStartChat={startChat} />
              <ReviewsSection />
            </>
          ) : (
            <div className="flex flex-col animate-fade-in max-w-6xl mx-auto">
              <div className="flex justify-center mb-6 bg-gradient-to-r from-white/70 via-chetna-lavender/30 to-white/70 dark:from-chetna-darker/70 dark:via-chetna-primary/15 dark:to-chetna-darker/70 backdrop-blur-xl rounded-full p-2 shadow-soft self-center border border-white/40 dark:border-chetna-primary/25">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  className={`rounded-full px-6 py-3 transition-all duration-300 ${
                    activeTab === 'chat' 
                      ? 'bg-gradient-to-r from-chetna-primary to-chetna-primary/90 shadow-glow transform scale-105' 
                      : 'hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 dark:hover:bg-chetna-primary/20'
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('intro.chatWithChetna')}
                  {activeTab === 'chat' && <Sparkles className="ml-2 h-4 w-4 animate-pulse" />}
                </Button>
                <Link to="/community">
                  <Button variant="ghost" className="rounded-full px-6 py-3 hover:bg-gradient-to-r hover:from-chetna-secondary/10 hover:to-chetna-secondary/20 dark:hover:bg-chetna-secondary/20 transition-all duration-300">
                    <Users className="mr-2 h-4 w-4" />
                    {t('intro.community')}
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button variant="ghost" className="rounded-full px-6 py-3 hover:bg-gradient-to-r hover:from-chetna-accent/10 hover:to-chetna-accent/20 dark:hover:bg-chetna-accent/20 transition-all duration-300">
                    <Star className="mr-2 h-4 w-4" />
                    {t('intro.chetnaQuest')}
                  </Button>
                </Link>
              </div>
              
              {activeTab === 'chat' && <ChatInterface />}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Customer Service Bot */}
      <CustomerServiceBot />
    </div>
  );
};

export default Index;
