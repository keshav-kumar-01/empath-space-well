
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import ChatInterface from "@/components/ChatInterface";
import { MessageSquare, Users, Star } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
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
      
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {showIntro ? (
            <IntroSection onStartChat={startChat} />
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-center mb-6 bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-full p-1 shadow-md self-center">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  className={`rounded-full ${
                    activeTab === 'chat' 
                      ? 'bg-gradient-to-r from-chetna-primary to-chetna-primary/90' 
                      : ''
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Chetna
                </Button>
                <Link to="/community">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button
                    variant="ghost"
                    className="rounded-full"
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
