
import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (optionId: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
        
        <RadioGroup 
          className="flex flex-col space-y-3 mb-6" 
          value={selectedOption || ""}
          onValueChange={handleOptionSelect}
        >
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
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="bg-chetna-primary hover:bg-chetna-primary/90"
          >
            Next Question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
