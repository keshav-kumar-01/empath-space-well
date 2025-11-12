
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Mic, 
  Moon, 
  Camera, 
  Target, 
  Users, 
  BarChart3, 
  MessageCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import LazySection from './LazySection';

// Memoized card component for better performance
const FeatureCard = memo(({ feature, index }: { feature: any; index: number }) => (
  <Link key={index} to={feature.path}>
    <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:scale-105 ${feature.color} border-2 hover:border-primary/30 will-change-transform bg-card/90 backdrop-blur-sm dark:bg-card/95`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-background/50 dark:bg-background/20 ${feature.iconColor}`}>
            <feature.icon className="h-6 w-6" />
          </div>
          {feature.badge && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
              {feature.badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-foreground">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  </Link>
));

FeatureCard.displayName = 'FeatureCard';

const AIFeaturesMenu = () => {
  const aiFeatures = [
    {
      title: 'Wellness Plans',
      description: 'AI-generated personalized mental health routines',
      icon: Sparkles,
      path: '/wellness-plans',
      color: 'bg-gradient-to-br from-pink-500/20 to-purple-500/30 dark:from-pink-500/10 dark:to-purple-500/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      badge: 'Popular'
    },
    {
      title: 'Voice Therapy',
      description: 'Talk through your feelings with AI voice analysis',
      icon: Mic,
      path: '/voice-therapy',
      color: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/30 dark:from-blue-500/10 dark:to-cyan-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'New'
    },
    {
      title: 'Dream Analysis',
      description: 'Understand your dreams with AI interpretation',
      icon: Moon,
      path: '/dream-analysis',
      color: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/30 dark:from-purple-500/10 dark:to-indigo-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Emotion Recognition',
      description: 'AI-powered facial emotion detection and analysis',
      icon: Camera,
      path: '/emotion-recognition',
      color: 'bg-gradient-to-br from-green-500/20 to-teal-500/30 dark:from-green-500/10 dark:to-teal-500/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Mental Health Goals',
      description: 'Set and track your mental wellness objectives',
      icon: Target,
      path: '/mental-health-goals',
      color: 'bg-gradient-to-br from-orange-500/20 to-red-500/30 dark:from-orange-500/10 dark:to-red-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Group Therapy',
      description: 'Join AI-moderated group therapy sessions',
      icon: Users,
      path: '/group-therapy',
      color: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/30 dark:from-teal-500/10 dark:to-cyan-500/20',
      iconColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      title: 'Mental Health Insights',
      description: 'AI-powered analysis of your mental health patterns',
      icon: BarChart3,
      path: '/mental-health-insights',
      color: 'bg-gradient-to-br from-violet-500/20 to-purple-500/30 dark:from-violet-500/10 dark:to-purple-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400'
    },
    {
      title: 'Peer Support',
      description: 'Connect with others through AI-powered matching',
      icon: MessageCircle,
      path: '/peer-support',
      color: 'bg-gradient-to-br from-rose-500/20 to-pink-500/30 dark:from-rose-500/10 dark:to-pink-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4 hover:bg-accent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">AI-Powered Features</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover cutting-edge AI tools designed to enhance your mental wellness journey
            </p>
          </div>
        </div>

        <LazySection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiFeatures.map((feature, index) => (
              <FeatureCard key={`${feature.path}-${index}`} feature={feature} index={index} />
            ))}
          </div>
        </LazySection>

        <LazySection>
          <div className="text-center">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border">
              <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                More AI Features Coming Soon!
              </h3>
              <p className="text-muted-foreground">
                We're constantly developing new AI-powered tools to support your mental health journey.
              </p>
            </div>
          </div>
        </LazySection>
      </main>
      
      <Footer />
    </div>
  );
};

export default memo(AIFeaturesMenu);
