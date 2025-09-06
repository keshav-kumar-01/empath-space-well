
import { useState, useEffect, useRef, memo, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Heart, Calendar, BookOpen, Users, Shield, MessageCircle } from "lucide-react";
import CustomerServiceBot from "@/components/CustomerServiceBot";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import FeatureCard from "@/components/FeatureCard";
import ReviewsSection from "@/components/ReviewsSection";
import BackgroundElements from "@/components/BackgroundElements";
import LazySection from "@/components/LazySection";
import SEO from "@/components/SEO";
import LoadingFallback from "@/components/LoadingFallback";
import { useTranslation } from 'react-i18next';
import { LazyChatInterface } from '@/utils/lazyComponents';

// Memoized components for better performance
const MemoizedFeatureCard = memo(FeatureCard);
const MemoizedReviewsSection = memo(ReviewsSection);
const MemoizedCustomerServiceBot = memo(CustomerServiceBot);

const Index = () => {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState(false);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  const handleStartChat = () => {
    setShowChat(true);
    
    // Immediate scroll after state update
    setTimeout(() => {
      if (chatSectionRef.current) {
        chatSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 50);
  };

  // Optimized features array with memoization
  const features = [
    {
      icon: Heart,
      title: t('features.moodTracking.title'),
      description: t('features.moodTracking.description'),
      path: "/mood-tracker",
      iconColor: "text-chetna-primary",
      backgroundGradient: "bg-gradient-to-br from-chetna-primary/20 to-chetna-primary/30 dark:from-chetna-primary/10 dark:to-chetna-primary/20"
    },
    {
      icon: Calendar,
      title: t('features.appointments.title'),
      description: t('features.appointments.description'),
      path: "/appointments",
      iconColor: "text-chetna-secondary",
      backgroundGradient: "bg-gradient-to-br from-chetna-secondary/20 to-chetna-secondary/30 dark:from-chetna-secondary/10 dark:to-chetna-secondary/20"
    },
    {
      icon: BookOpen,
      title: t('features.resources.title'),
      description: t('features.resources.description'),
      path: "/resources",
      iconColor: "text-chetna-accent",
      backgroundGradient: "bg-gradient-to-br from-chetna-accent/20 to-chetna-accent/30 dark:from-chetna-accent/10 dark:to-chetna-accent/20"
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      path: "/community",
      iconColor: "text-blue-600 dark:text-blue-400",
      backgroundGradient: "bg-gradient-to-br from-blue-500/20 to-blue-600/30 dark:from-blue-500/10 dark:to-blue-600/20"
    },
    {
      icon: Shield,
      title: t('features.crisis.title'),
      description: t('features.crisis.description'),
      path: "/crisis-support",
      iconColor: "text-red-600 dark:text-red-400",
      backgroundGradient: "bg-gradient-to-br from-red-500/20 to-red-600/30 dark:from-red-500/10 dark:to-red-600/20"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <SEO
        title="Chetna_AI - Your Mental Wellness Companion | AI-Powered Mental Health Support"
        description="Get compassionate AI support for anxiety, depression, stress management, and mental health challenges. Start your wellness journey with Chetna_AI today - available 24/7."
        keywords="mental health AI, anxiety support, depression help, stress management, emotional wellness, AI therapy, mental health companion, psychological support, wellness app, therapy chat"
        url="https://chetna.live"
        image="https://chetna.live/og-image.png"
      />
      
      <BackgroundElements />
      <Header />
      
      <main className="relative z-10" role="main">
        <IntroSection onStartChat={handleStartChat} />

        {/* Features Section with Lazy Loading */}
        <LazySection>
          <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="features-heading" className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
                  {t('features.title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('features.subtitle')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <MemoizedFeatureCard key={`${feature.path}-${index}`} {...feature} />
                ))}
              </div>
            </div>
          </section>
        </LazySection>

        {/* Chat Interface - Show immediately without lazy loading when user clicks Start Chatting */}
        {showChat && (
          <section 
            id="chat-section" 
            ref={chatSectionRef}
            className="py-16 px-4 sm:px-6 lg:px-8"
            aria-labelledby="chat-heading"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 id="chat-heading" className="text-3xl font-bold text-foreground mb-4">
                  {t('chat.title')}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t('chat.subtitle')}
                </p>
              </div>
              <Suspense fallback={<LoadingFallback text="Starting chat..." />}>
                <LazyChatInterface />
              </Suspense>
            </div>
          </section>
        )}

        <LazySection>
          <MemoizedReviewsSection />
        </LazySection>
        
        <LazySection>
          <MemoizedCustomerServiceBot />
        </LazySection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
