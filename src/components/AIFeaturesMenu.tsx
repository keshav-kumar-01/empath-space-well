
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
    <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:scale-105 ${feature.color} border-2 hover:border-chetna-primary/30 will-change-transform`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-white/50 ${feature.iconColor}`}>
            <feature.icon className="h-6 w-6" />
          </div>
          {feature.badge && (
            <Badge variant="secondary" className="text-xs">
              {feature.badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-gray-900">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 leading-relaxed">
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
      color: 'bg-gradient-to-br from-pink-500/20 to-purple-500/30',
      iconColor: 'text-pink-600',
      badge: 'Popular'
    },
    {
      title: 'Voice Therapy',
      description: 'Talk through your feelings with AI voice analysis',
      icon: Mic,
      path: '/voice-therapy',
      color: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/30',
      iconColor: 'text-blue-600',
      badge: 'New'
    },
    {
      title: 'Dream Analysis',
      description: 'Understand your dreams with AI interpretation',
      icon: Moon,
      path: '/dream-analysis',
      color: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/30',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Emotion Recognition',
      description: 'AI-powered facial emotion detection and analysis',
      icon: Camera,
      path: '/emotion-recognition',
      color: 'bg-gradient-to-br from-green-500/20 to-teal-500/30',
      iconColor: 'text-green-600'
    },
    {
      title: 'Mental Health Goals',
      description: 'Set and track your mental wellness objectives',
      icon: Target,
      path: '/goals',
      color: 'bg-gradient-to-br from-orange-500/20 to-red-500/30',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Group Therapy',
      description: 'Join AI-moderated group therapy sessions',
      icon: Users,
      path: '/group-therapy',
      color: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/30',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Mental Health Insights',
      description: 'AI-powered analysis of your mental health patterns',
      icon: BarChart3,
      path: '/insights',
      color: 'bg-gradient-to-br from-violet-500/20 to-purple-500/30',
      iconColor: 'text-violet-600'
    },
    {
      title: 'Peer Support',
      description: 'Connect with others through AI-powered matching',
      icon: MessageCircle,
      path: '/peer-support',
      color: 'bg-gradient-to-br from-rose-500/20 to-pink-500/30',
      iconColor: 'text-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-chetna-primary" />
              <h1 className="text-4xl font-bold text-gray-900">AI-Powered Features</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Heart className="h-8 w-8 text-chetna-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                More AI Features Coming Soon!
              </h3>
              <p className="text-gray-600">
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
