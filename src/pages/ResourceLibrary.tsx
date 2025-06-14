
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Play, Download, Heart, Brain, Meditation, Users, Shield, Clock } from 'lucide-react';

const ResourceLibrary: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'exercises', label: 'Exercises', icon: Meditation },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'worksheets', label: 'Worksheets', icon: Download },
  ];

  const resources = {
    articles: [
      {
        title: "Understanding Anxiety: A Complete Guide",
        description: "Learn about anxiety symptoms, causes, and effective management strategies",
        category: "Anxiety",
        readTime: "8 min read",
        tags: ["anxiety", "mental health", "coping"],
        difficulty: "Beginner",
        rating: 4.8
      },
      {
        title: "Building Emotional Resilience",
        description: "Techniques to bounce back from life's challenges with strength",
        category: "Resilience",
        readTime: "12 min read",
        tags: ["resilience", "emotional health", "recovery"],
        difficulty: "Intermediate",
        rating: 4.9
      },
      {
        title: "Mindful Living in Modern Times",
        description: "Incorporating mindfulness practices into your daily routine",
        category: "Mindfulness",
        readTime: "6 min read",
        tags: ["mindfulness", "meditation", "daily life"],
        difficulty: "Beginner",
        rating: 4.7
      }
    ],
    exercises: [
      {
        title: "5-4-3-2-1 Grounding Technique",
        description: "A simple exercise to manage anxiety and stay present",
        category: "Anxiety",
        duration: "5 minutes",
        tags: ["anxiety", "grounding", "mindfulness"],
        difficulty: "Beginner",
        rating: 4.9
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Reduce physical tension and promote relaxation",
        category: "Stress",
        duration: "15 minutes",
        tags: ["stress", "relaxation", "body awareness"],
        difficulty: "Beginner",
        rating: 4.8
      },
      {
        title: "Breathing Exercises for Calm",
        description: "Various breathing techniques for different situations",
        category: "Breathing",
        duration: "10 minutes",
        tags: ["breathing", "calm", "anxiety"],
        difficulty: "Beginner",
        rating: 4.7
      }
    ],
    videos: [
      {
        title: "Introduction to Meditation",
        description: "A beginner-friendly guide to starting your meditation practice",
        category: "Meditation",
        duration: "15 minutes",
        tags: ["meditation", "beginner", "mindfulness"],
        difficulty: "Beginner",
        rating: 4.8
      },
      {
        title: "Dealing with Depression",
        description: "Expert insights on understanding and managing depression",
        category: "Depression",
        duration: "25 minutes",
        tags: ["depression", "expert", "management"],
        difficulty: "Intermediate",
        rating: 4.9
      }
    ],
    worksheets: [
      {
        title: "Daily Mood Tracker",
        description: "Track your mood patterns and identify triggers",
        category: "Mood",
        format: "PDF",
        tags: ["mood", "tracking", "patterns"],
        difficulty: "Beginner",
        rating: 4.6
      },
      {
        title: "Anxiety Thought Challenge Worksheet",
        description: "Challenge negative thoughts and develop balanced thinking",
        category: "Anxiety",
        format: "PDF",
        tags: ["anxiety", "CBT", "thoughts"],
        difficulty: "Intermediate",
        rating: 4.8
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredResources = (categoryResources: any[]) => {
    if (!searchQuery) return categoryResources;
    return categoryResources.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Resource Library - Chetna_AI</title>
        <meta name="description" content="Comprehensive mental health resources, articles, exercises, and tools" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            Resource Library 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover evidence-based articles, exercises, and tools for your mental wellness journey
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Resource Categories */}
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(resources).map(([categoryId, categoryResources]) => (
            <TabsContent key={categoryId} value={categoryId}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources(categoryResources).map((resource, index) => (
                  <Card key={index} className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">
                          {resource.category}
                        </Badge>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.readTime || resource.duration || resource.format}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 fill-current text-red-500" />
                            {resource.rating}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity">
                          {categoryId === 'articles' && <BookOpen className="h-4 w-4 mr-2" />}
                          {categoryId === 'exercises' && <Meditation className="h-4 w-4 mr-2" />}
                          {categoryId === 'videos' && <Play className="h-4 w-4 mr-2" />}
                          {categoryId === 'worksheets' && <Download className="h-4 w-4 mr-2" />}
                          {categoryId === 'articles' && 'Read Article'}
                          {categoryId === 'exercises' && 'Try Exercise'}
                          {categoryId === 'videos' && 'Watch Video'}
                          {categoryId === 'worksheets' && 'Download'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourceLibrary;
