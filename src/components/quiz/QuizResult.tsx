
import React from 'react';
import { QuizResult as QuizResultType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BrainCircuit, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizResultProps {
  result: QuizResultType;
  onRetakeQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ result, onRetakeQuiz }) => {
  React.useEffect(() => {
    // Trigger confetti animation when results are shown
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card className="border border-chetna-primary/20 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-chetna-primary/10 to-chetna-accent/10 rounded-t-lg pb-6">
          <div className="mx-auto bg-chetna-primary text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <BrainCircuit size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-chetna-primary">{result.personalityType}</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <p className="mb-6 text-center">{result.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-chetna-primary">
                <CheckCircle size={18} /> Your Strengths
              </h3>
              <ul className="space-y-2 ml-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-chetna-primary">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-chetna-primary">Your Challenges</h3>
              <ul className="space-y-2 ml-2">
                {result.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-chetna-primary">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-medium mb-3 text-chetna-primary">Your Personality Traits</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="py-1.5 px-3">
                Emotional: {result.traits.emotional}
              </Badge>
              <Badge variant="outline" className="py-1.5 px-3">
                Analytical: {result.traits.analytical}
              </Badge>
              <Badge variant="outline" className="py-1.5 px-3">
                Social: {result.traits.social}
              </Badge>
              <Badge variant="outline" className="py-1.5 px-3">
                Creative: {result.traits.creative}
              </Badge>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-chetna-bubble/50 dark:bg-chetna-dark/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-chetna-primary">Advice for Growth</h3>
            <p>{result.advice}</p>
          </div>
          
          <div className="mt-6 p-4 bg-chetna-accent/10 dark:bg-chetna-dark/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-chetna-primary">Journal Prompt</h3>
            <p className="italic">{result.journalPrompt}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button variant="outline" onClick={onRetakeQuiz}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Take Quiz Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResult;
