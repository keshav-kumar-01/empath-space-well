
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
  {
    title: "Sadness",
    options: [
      "I do not feel sad",
      "I feel sad much of the time",
      "I am sad all the time",
      "I am so sad or unhappy I can't stand it"
    ]
  },
  {
    title: "Pessimism",
    options: [
      "I am not discouraged about my future",
      "I feel more discouraged about my future than I used to be",
      "I do not expect things to work out for me",
      "I feel my future is hopeless and will only get worse"
    ]
  },
  {
    title: "Past Failure",
    options: [
      "I do not feel like a failure",
      "I have failed more than I should have",
      "As I look back, I see a lot of failures",
      "I feel I am a total failure as a person"
    ]
  },
  {
    title: "Loss of Pleasure",
    options: [
      "I get as much pleasure as I ever did from the things I enjoy",
      "I don't enjoy things as much as I used to",
      "I get very little pleasure from the things I used to enjoy",
      "I can't get any pleasure from the things I used to enjoy"
    ]
  },
  {
    title: "Guilty Feelings",
    options: [
      "I don't feel particularly guilty",
      "I feel guilty over many things I have done or should have done",
      "I feel quite guilty most of the time",
      "I feel guilty all of the time"
    ]
  },
  {
    title: "Punishment Feelings",
    options: [
      "I don't feel I am being punished",
      "I feel I may be punished",
      "I expect to be punished",
      "I feel I am being punished"
    ]
  },
  {
    title: "Self-Dislike",
    options: [
      "I feel the same about myself as ever",
      "I have lost confidence in myself",
      "I am disappointed in myself",
      "I dislike myself"
    ]
  },
  {
    title: "Self-Criticalness",
    options: [
      "I don't criticize or blame myself more than usual",
      "I am more critical of myself than I used to be",
      "I criticize myself for all of my faults",
      "I blame myself for everything bad that happens"
    ]
  },
  {
    title: "Suicidal Thoughts or Wishes",
    options: [
      "I don't have any thoughts of killing myself",
      "I have thoughts of killing myself, but I would not carry them out",
      "I would like to kill myself",
      "I would kill myself if I had the chance"
    ]
  },
  {
    title: "Crying",
    options: [
      "I don't cry anymore than I used to",
      "I cry more than I used to",
      "I cry over every little thing",
      "I feel like crying, but I can't"
    ]
  },
  {
    title: "Agitation",
    options: [
      "I am no more restless or wound up than usual",
      "I feel more restless or wound up than usual",
      "I am so restless or agitated that it's hard to stay still",
      "I am so restless or agitated that I have to keep moving or doing something"
    ]
  },
  {
    title: "Loss of Interest",
    options: [
      "I have not lost interest in other people or activities",
      "I am less interested in other people or things than before",
      "I have lost most of my interest in other people or things",
      "It's hard to get interested in anything"
    ]
  },
  {
    title: "Indecisiveness",
    options: [
      "I make decisions about as well as ever",
      "I find it more difficult to make decisions than usual",
      "I have much greater difficulty in making decisions than I used to",
      "I have trouble making any decisions"
    ]
  },
  {
    title: "Worthlessness",
    options: [
      "I do not feel I am worthless",
      "I don't consider myself as worthwhile and useful as I used to",
      "I feel more worthless as compared to other people",
      "I feel utterly worthless"
    ]
  },
  {
    title: "Loss of Energy",
    options: [
      "I have as much energy as ever",
      "I have less energy than I used to have",
      "I don't have enough energy to do very much",
      "I don't have enough energy to do anything"
    ]
  },
  {
    title: "Changes in Sleeping Pattern",
    options: [
      "I have not experienced any change in my sleeping pattern",
      "I sleep somewhat more/less than usual",
      "I sleep a lot more/less than usual",
      "I sleep most of the day / I wake up 1-2 hours early and can't get back to sleep"
    ]
  },
  {
    title: "Irritability",
    options: [
      "I am no more irritable than usual",
      "I am more irritable than usual",
      "I am much more irritable than usual",
      "I am irritable all the time"
    ]
  },
  {
    title: "Changes in Appetite",
    options: [
      "I have not experienced any change in my appetite",
      "My appetite is somewhat less/greater than usual",
      "My appetite is much less/greater than usual",
      "I have no appetite at all / I crave food all the time"
    ]
  },
  {
    title: "Concentration Difficulty",
    options: [
      "I can concentrate as well as ever",
      "I can't concentrate as well as usual",
      "It's hard to keep my mind on anything for very long",
      "I find I can't concentrate on anything"
    ]
  },
  {
    title: "Tiredness or Fatigue",
    options: [
      "I am no more tired or fatigued than usual",
      "I get more tired or fatigued more easily than usual",
      "I am too tired or fatigued to do a lot of the things I used to do",
      "I am too tired or fatigued to do most of the things I used to do"
    ]
  },
  {
    title: "Loss of Interest in Sex",
    options: [
      "I have not noticed any recent change in my interest in sex",
      "I am less interested in sex than I used to be",
      "I have almost no interest in sex",
      "I have lost interest in sex completely"
    ]
  }
];

const BDI2Test = () => {
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
    if (score <= 13) return 'Minimal';
    if (score <= 19) return 'Mild';
    if (score <= 28) return 'Moderate';
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
          test_type: 'BDI-II',
          test_name: 'Beck Depression Inventory II',
          responses: responses,
          total_score: totalScore,
          severity_level: severityLevel
        });

      if (error) throw error;

      toast({
        title: "Test Completed",
        description: "Your BDI-II results have been saved successfully."
      });

      navigate('/psych-tests/results', { 
        state: { 
          testType: 'BDI-II',
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
  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Beck Depression Inventory II (BDI-II)
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
                Please read each group of statements carefully and choose the one statement in each group that best describes how you have been feeling during the past two weeks, including today.
              </h3>
              <p className="text-xl font-medium text-chetna-primary mb-6">
                {currentQuestionData.title}
              </p>
            </div>

            <RadioGroup
              value={responses[currentQuestion]?.toString()}
              onValueChange={(value) => handleResponse(parseInt(value))}
            >
              {currentQuestionData.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                    {option}
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

export default BDI2Test;
