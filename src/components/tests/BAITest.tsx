
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

      navigate('/psych-tests/results', { 
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Beck Anxiety Inventory (BAI)
            <span className="text-sm font-normal">
              {currentQuestion + 1} of {questions.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Below is a list of common symptoms of anxiety. Please rate how much you have been bothered by each symptom during the past week, including today:
              </h3>
              <p className="text-xl font-medium text-chetna-primary mb-6">
                {questions[currentQuestion]}
              </p>
            </div>

            <RadioGroup
              value={responses[currentQuestion]?.toString()}
              onValueChange={(value) => handleResponse(parseInt(value))}
            >
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={submitTest}
                  disabled={!canProceed || isSubmitting}
                  className="chetna-button"
                >
                  {isSubmitting ? "Submitting..." : "Complete Test"}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!canProceed}
                  className="chetna-button"
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
