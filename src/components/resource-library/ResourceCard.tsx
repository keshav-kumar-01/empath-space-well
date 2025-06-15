
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Brain, Play, Download, Heart, Clock } from 'lucide-react';

interface ResourceCardProps {
  resource: any;
  categoryId: string;
  onResourceAction: (resource: any, categoryId: string) => void;
  children: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  categoryId, 
  onResourceAction, 
  children 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getActionIcon = () => {
    switch (categoryId) {
      case 'articles': return <BookOpen className="h-4 w-4 mr-2" />;
      case 'exercises': return <Brain className="h-4 w-4 mr-2" />;
      case 'videos': return <Play className="h-4 w-4 mr-2" />;
      case 'worksheets': return <Download className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  const getActionText = () => {
    switch (categoryId) {
      case 'articles': return 'Read Article';
      case 'exercises': return 'Try Exercise';
      case 'videos': return 'Watch Video';
      case 'worksheets': return 'Download';
      default: return 'Open';
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
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
                onClick={() => onResourceAction(resource, categoryId)}
              >
                {getActionIcon()}
                {getActionText()}
              </Button>
            </DialogTrigger>
            {children}
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
