
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import ChatInterface from "@/components/ChatInterface";
import { MessageSquare, Users, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'community'>('chat');

  const startChat = () => {
    setShowIntro(false);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-chetna-dark dark:to-chetna-darker relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-chetna-primary/10 to-chetna-accent/10 rounded-full blur-xl floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-chetna-secondary/10 to-chetna-primary/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-chetna-accent/10 to-chetna-peach/20 rounded-full blur-xl floating" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-chetna-primary/10 to-chetna-secondary/10 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
      </div>

      <Helmet>
        <title>Chetna_AI - Your Mental Wellness Companion</title>
        <meta name="description" content="Experience compassionate AI support for anxiety, depression, stress, and other mental health challenges with Chetna_AI - your mental wellness companion." />
        <meta name="keywords" content="mental health AI, anxiety help, depression support, stress management, emotional wellness, mental health chat" />
        <link rel="canonical" href="https://empath-space-well.vercel.app/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              "name": "Chetna_AI",
              "description": "Your AI Mental Wellness Companion",
              "url": "https://empath-space-well.vercel.app",
              "sameAs": [
                "https://www.instagram.com/_chetna_ai_?utm_source=qr&igsh=YzU4eThnZzMxMXMw"
              ],
              "openingHours": "Mo-Su 00:00-24:00",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@chetna-ai.com"
              }
            }
          `}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center relative z-10">
        <div className="w-full max-w-6xl">
          {showIntro ? (
            <IntroSection onStartChat={startChat} />
          ) : (
            <div className="flex flex-col animate-fade-in">
              <div className="flex justify-center mb-8 bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-xl rounded-full p-2 shadow-soft self-center border border-white/20 dark:border-chetna-primary/20">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  className={`rounded-full px-6 py-3 transition-all duration-300 ${
                    activeTab === 'chat' 
                      ? 'bg-gradient-to-r from-chetna-primary to-chetna-primary/90 shadow-glow transform scale-105' 
                      : 'hover:bg-chetna-primary/10 dark:hover:bg-chetna-primary/20'
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Chetna
                  {activeTab === 'chat' && <Sparkles className="ml-2 h-4 w-4 animate-pulse" />}
                </Button>
                <Link to="/community">
                  <Button
                    variant="ghost"
                    className="rounded-full px-6 py-3 hover:bg-chetna-secondary/10 dark:hover:bg-chetna-secondary/20 transition-all duration-300"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button
                    variant="ghost"
                    className="rounded-full px-6 py-3 hover:bg-chetna-accent/10 dark:hover:bg-chetna-accent/20 transition-all duration-300"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Chetna Quest
                  </Button>
                </Link>
              </div>
              
              <div className="w-full">
                {activeTab === 'chat' && <ChatInterface />}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
