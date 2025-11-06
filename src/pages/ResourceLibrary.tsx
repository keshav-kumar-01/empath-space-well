
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Brain, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SearchBar from '@/components/resource-library/SearchBar';
import ResourceCard from '@/components/resource-library/ResourceCard';
import ResourceModal from '@/components/resource-library/ResourceModal';
import { categories, resources } from '@/components/resource-library/resourceData';

const ResourceLibrary: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0);

  const getIconComponent = (iconName: string) => {
    const icons = { BookOpen, Brain, Play, Download };
    return icons[iconName as keyof typeof icons] || BookOpen;
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
        break;
      case 'worksheets':
        handleDownload(resource);
        break;
    }
  };

  const generatePDFContent = (resource: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resource.title}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${resource.content}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = (resource: any) => {
    toast({
      title: "Generating PDF...",
      description: `Preparing ${resource.title} for download`,
    });
    
    setTimeout(() => {
      generatePDFContent(resource);
      toast({
        title: "PDF Ready! 📄",
        description: `${resource.title} is ready to print/save`,
      });
    }, 1000);
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
      setIsExerciseActive(false);
      toast({
        title: "Exercise Completed! 🎉",
        description: "Great job completing this mindfulness exercise.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Resource Library - Chetna_AI</title>
        <meta name="description" content="Comprehensive mental health resources, articles, exercises, and tools" />
        <link rel="canonical" href="https://chetna.live/resources" />
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

        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
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
                  <ResourceCard
                    key={index}
                    resource={resource}
                    categoryId={categoryId}
                    onResourceAction={handleResourceAction}
                  >
                    <ResourceModal
                      selectedResource={selectedResource}
                      isExerciseActive={isExerciseActive}
                      exerciseStep={exerciseStep}
                      exerciseProgress={exerciseProgress}
                      onStartExercise={startExercise}
                      onNextStep={nextExerciseStep}
                    />
                  </ResourceCard>
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
