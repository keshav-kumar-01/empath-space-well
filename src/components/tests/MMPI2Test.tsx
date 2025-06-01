
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

// Sample MMPI-2 questions (shortened version for demonstration)
const questions = [
  "I like mechanics magazines",
  "I have a good appetite",
  "I wake up fresh and rested most mornings",
  "I think I would like the work of a librarian",
  "I am easily awakened by noise",
  "I like to read newspaper articles on crime",
  "My hands and feet are usually warm enough",
  "My daily life is full of things that keep me interested",
  "I am about as able to work as I ever was",
  "There seems to be a lump in my throat much of the time",
  "A person should try to understand his dreams and be guided by or take warning from them",
  "I enjoy detective or mystery stories",
  "I work under a great deal of tension",
  "I have diarrhea once a month or more",
  "Once in a while I think of things too bad to talk about",
  "I am sure I get a raw deal from life",
  "My father was a good man",
  "I am very seldom troubled by constipation",
  "When I take a new job, I like to be tipped off on who should be gotten next to",
  "My sex life is satisfactory",
  "At times I have very much wanted to leave home",
  "At times I have fits of laughing and crying that I cannot control",
  "I am troubled by attacks of nausea and vomiting",
  "No one seems to understand me",
  "I would like to be a singer",
  "I feel that it is certainly best to keep my mouth shut when I'm in trouble",
  "Evil spirits possess me at times",
  "When someone does me a wrong I feel I should pay him back if I can, just for the principle of the thing",
  "I am bothered by acid stomach several times a week",
  "At times I feel like swearing",
  "I have nightmares every few nights",
  "I find it hard to keep my mind on a task or job",
  "I have had very peculiar and strange experiences",
  "I have a cough most of the time",
  "If people had not had it in for me I would have been much more successful",
  "I seldom worry about my health",
  "I have never been in trouble because of my sex behavior",
  "During one period when I was a youngster I engaged in petty thievery",
  "At times I feel like smashing things",
  "Most any time I would rather sit and daydream than to do anything else",
  "I have had periods of days, weeks, or months when I couldn't take care of things because I couldn't get going",
  "My family does not like the work I have chosen",
  "My sleep is fitful and disturbed",
  "Much of the time my head seems to hurt all over",
  "I do not always tell the truth",
  "My judgment is better than it ever was",
  "Once a week or oftener I feel suddenly hot all over without apparent cause",
  "When I am with people I am bothered by hearing very queer things",
  "It would be better if almost all laws were thrown away",
  "My soul sometimes leaves my body"
];

const MMPI2Test = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<boolean[]>(new Array(questions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResponse = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value === 'true';
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

  const calculateBasicScales = () => {
    // This is a simplified scoring system for demonstration
    // Real MMPI-2 scoring requires licensed software and professional interpretation
    const trueResponses = responses.filter(response => response === true).length;
    const falseResponses = responses.filter(response => response === false).length;
    
    return {
      responsePattern: `${trueResponses}T/${falseResponses}F`,
      completionRate: ((responses.filter(r => r !== null).length / questions.length) * 100).toFixed(1)
    };
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
    const unanswered = responses.filter(r => r === null).length;
    if (unanswered > 0) {
      toast({
        title: "Incomplete Test",
        description: `Please answer all questions. ${unanswered} questions remaining.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const results = calculateBasicScales();

    try {
      const { error } = await supabase
        .from('psychological_test_results')
        .insert({
          user_id: user.id,
          test_type: 'MMPI-2',
          test_name: 'Minnesota Multiphasic Personality Inventory-2',
          responses: responses,
          total_score: null, // MMPI-2 doesn't have a single total score
          severity_level: 'Professional Interpretation Required',
          additional_data: results
        });

      if (error) throw error;

      toast({
        title: "Test Completed",
        description: "Your MMPI-2 responses have been saved. Professional interpretation is recommended."
      });

      navigate('/psych-tests/results', { 
        state: { 
          testType: 'MMPI-2',
          score: 'Complete',
          severity: 'Professional Interpretation Required',
          responses: responses,
          additionalData: results
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
  const canProceed = responses[currentQuestion] !== null;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            MMPI-2 Personality Inventory
            <span className="text-sm font-normal">
              {currentQuestion + 1} of {questions.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm">
                <strong>Note:</strong> This is a shortened demonstration version. The full MMPI-2 contains 567 items and requires professional administration and interpretation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Read each statement and decide whether it is true or false as applied to you.
              </h3>
              <p className="text-xl font-medium text-chetna-primary mb-6">
                {questions[currentQuestion]}
              </p>
            </div>

            <RadioGroup
              value={responses[currentQuestion]?.toString()}
              onValueChange={handleResponse}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">
                  False
                </Label>
              </div>
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

            <div className="text-xs text-gray-500 text-center">
              Professional interpretation recommended for clinical use
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MMPI2Test;
