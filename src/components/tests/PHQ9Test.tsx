
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
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

const functionalQuestion = "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?";

const responseOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

const functionalOptions = [
  "Not difficult at all",
  "Somewhat difficult",
  "Very difficult",
  "Extremely difficult"
];

const PHQ9Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>(new Array(questions.length).fill(-1));
  const [functionalResponse, setFunctionalResponse] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalQuestions = questions.length + 1; // +1 for functional question
  const isOnFunctionalQuestion = currentQuestion === questions.length;

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
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
    if (score <= 4) return 'Minimal';
    if (score <= 9) return 'Mild';
    if (score <= 14) return 'Moderate';
    if (score <= 19) return 'Moderately severe';
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
          test_type: 'PHQ-9',
          test_name: 'Patient Health Questionnaire',
          responses: responses,
          total_score: totalScore,
          severity_level: severityLevel,
          additional_data: { functional_impairment: functionalResponse }
        });

      if (error) throw error;

      toast({
        title: "Test Completed",
        description: "Your PHQ-9 results have been saved successfully."
      });

      navigate('/psych-tests/results', { 
        state: { 
          testType: 'PHQ-9',
          score: totalScore,
          severity: severityLevel,
          responses: responses,
          functionalImpairment: functionalResponse
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

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  
  let canProceed = false;
  if (isOnFunctionalQuestion) {
    canProceed = functionalResponse !== '';
  } else {
    canProceed = responses[currentQuestion] !== -1;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            PHQ-9 Assessment
            <span className="text-sm font-normal">
              {currentQuestion + 1} of {totalQuestions}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isOnFunctionalQuestion ? (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Functional Assessment:
                </h3>
                <p className="text-xl font-medium text-chetna-primary mb-6">
                  {functionalQuestion}
                </p>
                
                <RadioGroup
                  value={functionalResponse}
                  onValueChange={setFunctionalResponse}
                >
                  {functionalOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`functional-${index}`} />
                      <Label htmlFor={`functional-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Over the last 2 weeks, how often have you been bothered by:
                </h3>
                <p className="text-xl font-medium text-chetna-primary mb-6">
                  {questions[currentQuestion]}
                </p>

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
              </div>
            )}

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

export default PHQ9Test;
