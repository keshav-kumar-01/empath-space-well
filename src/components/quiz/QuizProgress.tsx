
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = ((currentQuestion) / totalQuestions) * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Question {currentQuestion} of {totalQuestions}</span>
        <span className="text-sm font-medium">{Math.round(progressPercentage)}% Complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2.5 bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default QuizProgress;
