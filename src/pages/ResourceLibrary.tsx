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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Search, BookOpen, Play, Download, Heart, Brain, Users, Shield, Clock, X, PlayCircle, Pause, SkipForward } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResourceLibrary: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const categories = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'exercises', label: 'Exercises', icon: Brain },
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
        rating: 4.8,
        content: `
          <h2>Understanding Anxiety</h2>
          <p>Anxiety is a natural response to stress and can be beneficial in some situations. However, when anxiety becomes overwhelming or persistent, it may indicate an anxiety disorder.</p>
          
          <h3>Common Symptoms</h3>
          <ul>
            <li>Excessive worry or fear</li>
            <li>Restlessness or feeling on edge</li>
            <li>Difficulty concentrating</li>
            <li>Physical symptoms like rapid heartbeat</li>
          </ul>
          
          <h3>Management Strategies</h3>
          <p>There are several effective ways to manage anxiety:</p>
          <ul>
            <li><strong>Deep breathing exercises</strong> - Help calm the nervous system</li>
            <li><strong>Progressive muscle relaxation</strong> - Reduces physical tension</li>
            <li><strong>Mindfulness meditation</strong> - Helps stay present and grounded</li>
            <li><strong>Regular exercise</strong> - Natural anxiety reducer</li>
          </ul>
        `
      },
      {
        title: "Building Emotional Resilience",
        description: "Techniques to bounce back from life's challenges with strength",
        category: "Resilience",
        readTime: "12 min read",
        tags: ["resilience", "emotional health", "recovery"],
        difficulty: "Intermediate",
        rating: 4.9,
        content: `
          <h2>Building Emotional Resilience</h2>
          <p>Emotional resilience is the ability to adapt and bounce back from adversity, trauma, or stress.</p>
          
          <h3>Key Components</h3>
          <ul>
            <li>Self-awareness and emotional regulation</li>
            <li>Strong support networks</li>
            <li>Problem-solving skills</li>
            <li>Adaptability and flexibility</li>
          </ul>
        `
      },
      {
        title: "Mindful Living in Modern Times",
        description: "Incorporating mindfulness practices into your daily routine",
        category: "Mindfulness",
        readTime: "6 min read",
        tags: ["mindfulness", "meditation", "daily life"],
        difficulty: "Beginner",
        rating: 4.7,
        content: `
          <h2>Mindful Living</h2>
          <p>Mindfulness is about being fully present in the moment, aware of where you are and what you're doing.</p>
          
          <h3>Daily Practices</h3>
          <ul>
            <li>Mindful breathing</li>
            <li>Body scan meditation</li>
            <li>Mindful eating</li>
            <li>Walking meditation</li>
          </ul>
        `
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
        rating: 4.9,
        steps: [
          "Take a deep breath and look around you",
          "Name 5 things you can see",
          "Name 4 things you can touch",
          "Name 3 things you can hear",
          "Name 2 things you can smell",
          "Name 1 thing you can taste"
        ]
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Reduce physical tension and promote relaxation",
        category: "Stress",
        duration: "15 minutes",
        tags: ["stress", "relaxation", "body awareness"],
        difficulty: "Beginner",
        rating: 4.8,
        steps: [
          "Find a comfortable position and close your eyes",
          "Start with your toes - tense for 5 seconds, then relax",
          "Move to your feet - tense and relax",
          "Continue with calves, thighs, abdomen",
          "Progress to hands, arms, shoulders",
          "Finish with neck and face muscles",
          "Take a moment to notice the relaxation"
        ]
      },
      {
        title: "Breathing Exercises for Calm",
        description: "Various breathing techniques for different situations",
        category: "Breathing",
        duration: "10 minutes",
        tags: ["breathing", "calm", "anxiety"],
        difficulty: "Beginner",
        rating: 4.7,
        steps: [
          "Sit comfortably with your back straight",
          "Place one hand on chest, one on belly",
          "Breathe in slowly through your nose for 4 counts",
          "Hold your breath for 4 counts",
          "Exhale slowly through your mouth for 6 counts",
          "Repeat this cycle 10 times",
          "Notice how you feel afterwards"
        ]
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
        rating: 4.8,
        videoUrl: "https://example.com/meditation-intro" // Placeholder
      },
      {
        title: "Dealing with Depression",
        description: "Expert insights on understanding and managing depression",
        category: "Depression",
        duration: "25 minutes",
        tags: ["depression", "expert", "management"],
        difficulty: "Intermediate",
        rating: 4.9,
        videoUrl: "https://example.com/depression-help" // Placeholder
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
        rating: 4.6,
        downloadUrl: "/worksheets/mood-tracker.pdf"
      },
      {
        title: "Anxiety Thought Challenge Worksheet",
        description: "Challenge negative thoughts and develop balanced thinking",
        category: "Anxiety",
        format: "PDF",
        tags: ["anxiety", "CBT", "thoughts"],
        difficulty: "Intermediate",
        rating: 4.8,
        downloadUrl: "/worksheets/thought-challenge.pdf"
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

  const handleResourceAction = (resource: any, categoryId: string) => {
    switch (categoryId) {
      case 'articles':
        setSelectedResource({ ...resource, type: 'article' });
        break;
      case 'exercises':
        setSelectedResource({ ...resource, type: 'exercise' });
        setExerciseStep(0);
        setExerciseProgress(0);
        setIsExerciseActive(false);
        break;
      case 'videos':
        setSelectedResource({ ...resource, type: 'video' });
        setIsVideoPlaying(false);
        break;
      case 'worksheets':
        handleDownload(resource);
        break;
    }
  };

  const handleDownload = (resource: any) => {
    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded...`,
    });
    // In a real app, this would trigger an actual download
    console.log('Downloading:', resource.downloadUrl);
  };

  const startExercise = () => {
    setIsExerciseActive(true);
    setExerciseStep(0);
    setExerciseProgress(0);
  };

  const nextExerciseStep = () => {
    if (selectedResource && exerciseStep < selectedResource.steps.length - 1) {
      const newStep = exerciseStep + 1;
      setExerciseStep(newStep);
      setExerciseProgress((newStep / selectedResource.steps.length) * 100);
    } else {
      // Exercise completed
      setIsExerciseActive(false);
      toast({
        title: "Exercise Completed! 🎉",
        description: "Great job completing this mindfulness exercise.",
      });
    }
  };

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
    toast({
      title: isVideoPlaying ? "Video Paused" : "Video Playing",
      description: `${selectedResource?.title} ${isVideoPlaying ? 'paused' : 'is now playing'}`,
    });
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

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity"
                              onClick={() => handleResourceAction(resource, categoryId)}
                            >
                              {categoryId === 'articles' && <BookOpen className="h-4 w-4 mr-2" />}
                              {categoryId === 'exercises' && <Brain className="h-4 w-4 mr-2" />}
                              {categoryId === 'videos' && <Play className="h-4 w-4 mr-2" />}
                              {categoryId === 'worksheets' && <Download className="h-4 w-4 mr-2" />}
                              {categoryId === 'articles' && 'Read Article'}
                              {categoryId === 'exercises' && 'Try Exercise'}
                              {categoryId === 'videos' && 'Watch Video'}
                              {categoryId === 'worksheets' && 'Download'}
                            </Button>
                          </DialogTrigger>

                          {/* Article Modal */}
                          {selectedResource?.type === 'article' && (
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{selectedResource.title}</DialogTitle>
                                <DialogDescription>
                                  {selectedResource.readTime} • {selectedResource.category}
                                </DialogDescription>
                              </DialogHeader>
                              <div 
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: selectedResource.content }}
                              />
                            </DialogContent>
                          )}

                          {/* Exercise Modal */}
                          {selectedResource?.type === 'exercise' && (
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{selectedResource.title}</DialogTitle>
                                <DialogDescription>
                                  {selectedResource.duration} • {selectedResource.category}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {!isExerciseActive ? (
                                <div className="space-y-4">
                                  <p className="text-muted-foreground">{selectedResource.description}</p>
                                  <Button onClick={startExercise} className="w-full">
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Exercise
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Progress</span>
                                      <span>{exerciseStep + 1} of {selectedResource.steps.length}</span>
                                    </div>
                                    <Progress value={exerciseProgress} className="w-full" />
                                  </div>
                                  
                                  <div className="text-center space-y-4">
                                    <h3 className="text-lg font-semibold">Step {exerciseStep + 1}</h3>
                                    <p className="text-lg">{selectedResource.steps[exerciseStep]}</p>
                                  </div>
                                  
                                  <Button onClick={nextExerciseStep} className="w-full">
                                    {exerciseStep < selectedResource.steps.length - 1 ? (
                                      <>
                                        <SkipForward className="h-4 w-4 mr-2" />
                                        Next Step
                                      </>
                                    ) : (
                                      <>
                                        Complete Exercise
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          )}

                          {/* Video Modal */}
                          {selectedResource?.type === 'video' && (
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{selectedResource.title}</DialogTitle>
                                <DialogDescription>
                                  {selectedResource.duration} • {selectedResource.category}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                  <div className="text-center space-y-4">
                                    <PlayCircle className="h-16 w-16 text-chetna-primary mx-auto" />
                                    <p className="text-muted-foreground">Video Player Placeholder</p>
                                    <p className="text-sm">In a real app, this would embed the actual video</p>
                                  </div>
                                </div>
                                
                                <div className="flex justify-center space-x-4">
                                  <Button onClick={toggleVideoPlay}>
                                    {isVideoPlaying ? (
                                      <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                      </>
                                    ) : (
                                      <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
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
