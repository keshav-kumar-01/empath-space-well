
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, SkipForward } from 'lucide-react';

interface ExerciseModalProps {
  resource: any;
  isExerciseActive: boolean;
  exerciseStep: number;
  exerciseProgress: number;
  onStartExercise: () => void;
  onNextStep: () => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  resource,
  isExerciseActive,
  exerciseStep,
  exerciseProgress,
  onStartExercise,
  onNextStep
}) => {
  if (!resource || resource.type !== 'exercise') return null;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{resource.title}</DialogTitle>
        <DialogDescription>
          {resource.duration} • {resource.category}
        </DialogDescription>
      </DialogHeader>
      
      {!isExerciseActive ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">{resource.description}</p>
          <Button onClick={onStartExercise} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Exercise
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{exerciseStep + 1} of {resource.steps.length}</span>
            </div>
            <Progress value={exerciseProgress} className="w-full" />
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Step {exerciseStep + 1}</h3>
            <p className="text-lg">{resource.steps[exerciseStep]}</p>
          </div>
          
          <Button onClick={onNextStep} className="w-full">
            {exerciseStep < resource.steps.length - 1 ? (
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
  );
};

export default ExerciseModal;
