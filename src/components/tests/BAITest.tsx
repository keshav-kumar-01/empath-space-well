
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const questions = [
  "Numbness or tingling",
  "Feeling hot",
  "Wobbliness in legs",
  "Unable to relax",
  "Fear of the worst happening",
  "Dizzy or lightheaded",
  "Heart pounding or racing",
  "Unsteady",
  "Terrified",
  "Nervous",
  "Feeling of choking",
  "Hands trembling",
  "Shaky",
  "Fear of losing control",
  "Difficulty breathing",
  "Fear of dying",
  "Scared",
  "Indigestion or discomfort in abdomen",
  "Faint/lightheaded",
  "Face flushed",
  "Sweating (not due to heat)"
];

const responseOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Mildly (did not bother me much)" },
  { value: 2, label: "Moderately (very unpleasant, but I could stand it)" },
  { value: 3, label: "Severely (could barely stand it)" }
];

const BAITest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return responses.reduce((sum, response) => sum + response, 0);
  };

  const getSeverityLevel = (score: number) => {
    if (score <= 21) return 'Low anxiety';
    if (score <= 35) return 'Moderate';
    return 'Severe';
  };

  const submitTest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your test results.",
        variant: "destructive"
      });
      return;
    }

    // Check if all questions are answered
    const unanswered = responses.filter(r => r === -1).length;
    if (unanswered > 0) {
      toast({
        title: "Incomplete Test",
        description: `Please answer all questions. ${unanswered} questions remaining.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const totalScore = calculateScore();
    const severityLevel = getSeverityLevel(totalScore);

    try {
      const { error } = await supabase
        .from('psychological_test_results')
        .insert({
          user_id: user.id,
          test_type: 'BAI',
          test_name: 'Beck Anxiety Inventory',
          responses: responses,
          total_score: totalScore,
          severity_level: severityLevel
        });

      if (error) throw error;

      toast({
        title: "Test Completed",
        description: "Your BAI results have been saved successfully."
      });

      // Fix navigation path
      navigate('/test-results', { 
        state: { 
          testType: 'BAI',
          score: totalScore,
          severity: severityLevel,
          responses: responses
        }
      });
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        title: "Error",
        description: "Failed to save test results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQuestion] !== -1;
  const currentResponse = responses[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-chetna-primary/20">
        <CardHeader className="bg-gradient-to-r from-chetna-primary/5 to-chetna-secondary/5">
          <CardTitle className="flex items-center justify-between text-chetna-primary">
            Beck Anxiety Inventory (BAI)
            <span className="text-sm font-normal text-gray-600">
              {currentQuestion + 1} of {questions.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">
                Below is a list of common symptoms of anxiety. Please rate how much you have been bothered by each symptom during the past week, including today:
              </h3>
              <p className="text-xl font-medium text-chetna-primary mb-6">
                {questions[currentQuestion]}
              </p>
            </div>

            <RadioGroup
              value={currentResponse === -1 ? undefined : currentResponse.toString()}
              onValueChange={(value) => handleResponse(parseInt(value))}
              className="space-y-3"
            >
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`option-${currentQuestion}-${option.value}`} />
                  <Label htmlFor={`option-${currentQuestion}-${option.value}`} className="flex-1 cursor-pointer text-base">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!canProceed && (
              <p className="text-sm text-red-600 mt-2">Please select an option to continue.</p>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="px-6"
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={submitTest}
                  disabled={!canProceed || isSubmitting}
                  className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-6"
                >
                  {isSubmitting ? "Submitting..." : "Complete Test"}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!canProceed}
                  className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-6"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BAITest;
