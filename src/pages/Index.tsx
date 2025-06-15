
import React, { useState, useCallback, memo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import ReviewsSection from "@/components/ReviewsSection";
import CustomerServiceBot from "@/components/CustomerServiceBot";
import BackgroundElements from "@/components/BackgroundElements";
import TabNavigation from "@/components/TabNavigation";

// Lazy load ChatInterface for better initial load performance
const ChatInterface = React.lazy(() => import("@/components/ChatInterface"));

const Index: React.FC = memo(() => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'community'>('chat');

  const startChat = useCallback(() => {
    setShowIntro(false);
    setActiveTab('chat');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      <BackgroundElements />
      
      <Helmet>
        <title>Chetna_AI - Your Mental Wellness Companion</title>
        <meta name="description" content="Experience compassionate AI support for anxiety, depression, stress, and other mental health challenges with Chetna_AI - your mental wellness companion." />
        <meta name="keywords" content="mental health AI, anxiety help, depression support, stress management, emotional wellness, mental health chat" />
        <link rel="canonical" href="https://empath-space-well.vercel.app/" />
        <link rel="preload" href="/favicon.ico" as="image" />
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
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
              {activeTab === 'chat' && (
                <React.Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chetna-primary"></div>
                  </div>
                }>
                  <ChatInterface />
                </React.Suspense>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <CustomerServiceBot />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
