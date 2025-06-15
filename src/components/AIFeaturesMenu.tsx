
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Mic, 
  Moon, 
  Camera, 
  Target, 
  Users, 
  BarChart3, 
  Heart,
  Brain,
  ArrowRight 
} from 'lucide-react';

const AIFeaturesMenu = () => {
  const features = [
    {
      title: 'Wellness Plans',
      description: 'AI-generated daily/weekly mental health routines',
      icon: <Sparkles className="h-6 w-6" />,
      path: '/wellness-plans',
      color: 'from-pink-500 to-purple-500',
      badge: 'AI-Powered'
    },
    {
      title: 'Voice Therapy',
      description: 'AI voice conversations for anxiety/stress relief',
      icon: <Mic className="h-6 w-6" />,
      path: '/voice-therapy',
      color: 'from-blue-500 to-indigo-500',
      badge: 'Voice AI'
    },
    {
      title: 'Dream Analysis',
      description: 'AI interpretation of your dreams',
      icon: <Moon className="h-6 w-6" />,
      path: '/dream-analysis',
      color: 'from-purple-500 to-pink-500',
      badge: 'Psychology'
    },
    {
      title: 'Emotion Recognition',
      description: 'Upload photos for mood analysis',
      icon: <Camera className="h-6 w-6" />,
      path: '/emotion-recognition',
      color: 'from-green-500 to-teal-500',
      badge: 'Computer Vision'
    },
    {
      title: 'Mental Health Goals',
      description: 'Gamified mental health goals',
      icon: <Target className="h-6 w-6" />,
      path: '/goals',
      color: 'from-orange-500 to-red-500',
      badge: 'Goal Tracking'
    },
    {
      title: 'Group Therapy',
      description: 'Video conferencing for group sessions',
      icon: <Users className="h-6 w-6" />,
      path: '/group-therapy',
      color: 'from-cyan-500 to-blue-500',
      badge: 'Community'
    },
    {
      title: 'Mental Health Insights',
      description: 'Detailed progress tracking and trends',
      icon: <BarChart3 className="h-6 w-6" />,
      path: '/insights',
      color: 'from-indigo-500 to-purple-500',
      badge: 'Analytics'
    },
    {
      title: 'Peer Support',
      description: 'AI-powered peer buddy system',
      icon: <Heart className="h-6 w-6" />,
      path: '/peer-support',
      color: 'from-rose-500 to-pink-500',
      badge: 'AI Matching'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          AI-Powered Features
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our advanced AI features designed to enhance your mental wellness journey with 
          personalized insights and intelligent support.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 group border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>
              <Link to={feature.path}>
                <Button 
                  className="w-full group/btn bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-500 hover:to-pink-500 text-gray-700 hover:text-white transition-all duration-300"
                  variant="outline"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Powered by Advanced AI
              </h3>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI features use cutting-edge machine learning algorithms to provide personalized 
              mental health support. From analyzing your emotional patterns to matching you with 
              compatible peers, our AI is designed to understand and support your unique journey.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="text-center">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Personalized AI</h4>
                <p className="text-gray-600">Adapts to your unique mental health profile</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <h4 className="font-medium">Empathetic Support</h4>
                <p className="text-gray-600">AI trained in therapeutic communication</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Data-Driven Insights</h4>
                <p className="text-gray-600">Analytics for meaningful progress tracking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeaturesMenu;
