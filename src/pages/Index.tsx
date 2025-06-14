
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced background elements with improved animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute top-20 left-10 w-60 h-60 bg-gradient-to-br from-violet-400/20 to-purple-600/20 dark:from-violet-500/30 dark:to-purple-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-400/15 to-teal-500/15 dark:from-emerald-500/25 dark:to-teal-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-gradient-to-br from-pink-400/20 to-rose-500/20 dark:from-pink-500/30 dark:to-rose-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
        
        {/* Center focal point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 dark:from-indigo-400/20 dark:to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1.5s' }}></div>
        
        {/* Additional ambient elements */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-yellow-300/15 to-orange-400/15 dark:from-yellow-400/25 dark:to-orange-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-green-300/15 to-emerald-400/15 dark:from-green-400/25 dark:to-emerald-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '2.5s' }}></div>
      </div>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-[0.5px] pointer-events-none"></div>

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
              <div className="flex justify-center mb-8 relative">
                {/* Enhanced tab container with glassmorphism effect */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-blue-400/10"></div>
                  
                  <div className="flex space-x-2 relative z-10">
                    <Button
                      variant={activeTab === 'chat' ? 'default' : 'ghost'}
                      className={`rounded-xl px-8 py-4 transition-all duration-500 font-medium ${
                        activeTab === 'chat' 
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 dark:shadow-violet-400/25 transform scale-105 text-white' 
                          : 'hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300'
                      }`}
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageSquare className="mr-3 h-5 w-5" />
                      {t('intro.chatWithChetna')}
                      {activeTab === 'chat' && <Sparkles className="ml-3 h-5 w-5 animate-pulse" />}
                    </Button>
                    
                    <Link to="/community">
                      <Button 
                        variant="ghost" 
                        className="rounded-xl px-8 py-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-500 font-medium"
                      >
                        <Users className="mr-3 h-5 w-5" />
                        {t('intro.community')}
                      </Button>
                    </Link>
                    
                    <Link to="/quiz">
                      <Button 
                        variant="ghost" 
                        className="rounded-xl px-8 py-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-500 font-medium"
                      >
                        <Star className="mr-3 h-5 w-5" />
                        {t('intro.chetnaQuest')}
                      </Button>
                    </Link>
                  </div>
                </div>
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
