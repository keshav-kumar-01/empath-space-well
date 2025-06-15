
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ArticleModalProps {
  resource: any;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ resource }) => {
  if (!resource || resource.type !== 'article') return null;

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{resource.title}</DialogTitle>
        <DialogDescription>
          {resource.readTime} • {resource.category}
        </DialogDescription>
      </DialogHeader>
      <div 
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: resource.content }}
      />
    </DialogContent>
  );
};

export default ArticleModal;
