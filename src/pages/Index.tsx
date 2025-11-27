
import { useState, useEffect, useRef, memo, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Heart, Calendar, BookOpen, Users, Shield, MessageCircle } from "lucide-react";
import CustomerServiceBot from "@/components/CustomerServiceBot";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import IntroSection from "@/components/IntroSection";
import FeatureCard from "@/components/FeatureCard";
import ReviewsSection from "@/components/ReviewsSection";
import BackgroundElements from "@/components/BackgroundElements";
import LazySection from "@/components/LazySection";
import SEO from "@/components/SEO";
import LoadingSpinner from "@/components/LoadingSpinner";
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
        title="Chetna AI - Mental Health AI | AI Therapy & Psychological Support Platform"
        description="Chetna AI: Leading mental health AI platform. Get 24/7 AI therapy, psychological tests, psychologist appointments, and mental wellness support. Instant help for anxiety, depression, stress. Free mental health AI companion."
        keywords="mental health AI, AI therapy, chetna, chetna ai, chetna_ai, health AI, mental wellness AI, psychological tests, psychologist appointment, anxiety help AI, depression support AI, stress management, mental health chatbot, AI counseling, therapy AI, mental health support, online therapy, psychological evaluation, mental health assessment, wellness AI, therapy chatbot, AI psychiatrist, mental health screening, psychological tests online"
        url="https://chetna.life"
        image="https://chetna.life/og-image.png"
        canonical="https://chetna.life"
        breadcrumbs={[
          { name: "Home", url: "https://chetna.life/" }
        ]}
        faqSchema={[
          {
            question: "What is Chetna AI?",
            answer: "Chetna AI is a leading mental health AI platform that provides 24/7 AI therapy, psychological tests, and comprehensive mental wellness support. Our AI-powered platform helps millions with anxiety, depression, stress management, and various mental health challenges."
          },
          {
            question: "How does Chetna AI help with mental health?",
            answer: "Chetna AI offers AI therapy chatbot, mood tracking, psychological tests (GAD-7, PHQ-9, Beck tests), journaling tools, psychologist appointments, crisis support, and personalized wellness plans. Get instant mental health support anytime, anywhere."
          },
          {
            question: "What psychological tests are available on Chetna AI?",
            answer: "Chetna AI provides scientifically validated psychological tests including GAD-7 (anxiety test), PHQ-9 (depression test), Beck Anxiety Inventory, Beck Depression Inventory, MMPI-2, and cognitive performance tests. All tests are free and confidential."
          },
          {
            question: "Can I book a psychologist appointment through Chetna AI?",
            answer: "Yes! Chetna AI connects you with licensed psychologists and therapists. You can easily book online therapy sessions and counseling appointments through our platform."
          },
          {
            question: "Is Chetna AI free to use?",
            answer: "Yes, Chetna AI offers free access to core features including AI therapy chat, psychological tests, mood tracking, and basic resources. Premium features including unlimited AI sessions and priority psychologist appointments are available with a subscription."
          },
          {
            question: "Is my mental health data safe with Chetna AI?",
            answer: "Absolutely. Chetna AI uses end-to-end encryption and follows strict HIPAA-compliant privacy protocols to ensure your conversations, psychological test results, and personal data remain completely confidential and secure."
          },
          {
            question: "How is Chetna AI different from traditional therapy?",
            answer: "Chetna AI provides instant 24/7 mental health support through AI therapy, while also connecting you to licensed therapists when needed. It's more accessible, affordable, and available anytime. Our AI complements traditional therapy, not replaces it."
          },
          {
            question: "Does Chetna AI work with ChatGPT or other AI platforms?",
            answer: "Chetna AI is a specialized mental health AI platform built specifically for psychological support. While it uses advanced AI technology, it's purpose-built for mental health care with specialized training in therapy, counseling, and psychological assessment."
          }
        ]}
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
              <Suspense fallback={<LoadingSpinner text="Starting chat..." />}>
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
      <BackToTop />
    </div>
  );
};

export default Index;
