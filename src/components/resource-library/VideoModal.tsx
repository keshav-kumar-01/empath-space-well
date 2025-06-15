
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoModalProps {
  resource: any;
}

const VideoModal: React.FC<VideoModalProps> = ({ resource }) => {
  if (!resource || resource.type !== 'video') return null;

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>{resource.title}</DialogTitle>
        <DialogDescription>
          {resource.duration} • {resource.category}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
          <iframe
            src={resource.videoUrl}
            title={resource.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground">{resource.description}</p>
        </div>
      </div>
    </DialogContent>
  );
};

export default VideoModal;
