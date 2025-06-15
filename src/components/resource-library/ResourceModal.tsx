
import React from 'react';
import ArticleModal from './ArticleModal';
import ExerciseModal from './ExerciseModal';
import VideoModal from './VideoModal';

interface ResourceModalProps {
  selectedResource: any;
  isExerciseActive: boolean;
  exerciseStep: number;
  exerciseProgress: number;
  onStartExercise: () => void;
  onNextStep: () => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  selectedResource,
  isExerciseActive,
  exerciseStep,
  exerciseProgress,
  onStartExercise,
  onNextStep
}) => {
  if (!selectedResource) return null;

  switch (selectedResource.type) {
    case 'article':
      return <ArticleModal resource={selectedResource} />;
    case 'exercise':
      return (
        <ExerciseModal
          resource={selectedResource}
          isExerciseActive={isExerciseActive}
          exerciseStep={exerciseStep}
          exerciseProgress={exerciseProgress}
          onStartExercise={onStartExercise}
          onNextStep={onNextStep}
        />
      );
    case 'video':
      return <VideoModal resource={selectedResource} />;
    default:
      return null;
  }
};

export default ResourceModal;
