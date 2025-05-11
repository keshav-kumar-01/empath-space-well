
import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (optionId: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
        
        <RadioGroup className="flex flex-col space-y-3">
          {question.options.map(option => (
            <label
              key={option.id}
              className="flex items-center space-x-2 p-3 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all"
              htmlFor={option.id}
            >
              <RadioGroupItem value={option.id} id={option.id} className="mr-2" />
              <span>{option.text}</span>
            </label>
          ))}
        </RadioGroup>
        
        <div className="flex justify-end mt-6">
          {question.options.map(option => (
            <Button
              key={option.id}
              variant="default"
              className="ml-2"
              onClick={() => onAnswer(option.id)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
