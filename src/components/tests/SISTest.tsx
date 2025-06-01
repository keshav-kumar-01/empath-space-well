
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

const domains = [
  {
    title: "Home Living",
    questions: [
      "Preparing meals",
      "Taking care of personal finances",
      "Taking care of personal possessions",
      "Housekeeping and cleaning",
      "Dressing",
      "Bathing and taking care of personal hygiene",
      "Operating home appliances",
      "Getting around in the home"
    ]
  },
  {
    title: "Community Living",
    questions: [
      "Getting from place to place throughout the community",
      "Shopping and purchasing goods and services",
      "Using public services in the community",
      "Going to visit friends and family",
      "Participating in recreation/leisure activities in community settings",
      "Using public transportation",
      "Participating in preferred community activities"
    ]
  },
  {
    title: "Lifelong Learning",
    questions: [
      "Participating in training/educational decisions",
      "Learning and using problem-solving strategies",
      "Using technology for learning",
      "Accessing training/educational settings",
      "Learning functional academics",
      "Learning health and physical education skills",
      "Learning self-determination skills",
      "Receiving training/education in home and community settings"
    ]
  },
  {
    title: "Employment",
    questions: [
      "Accessing/receiving job/task accommodations",
      "Learning and using specific job skills",
      "Interacting with co-workers",
      "Interacting with supervisors/coaches",
      "Completing work-related tasks with acceptable speed",
      "Completing work-related tasks with acceptable quality",
      "Changing job assignments",
      "Seeking information and assistance from employers"
    ]
  },
  {
    title: "Health and Safety",
    questions: [
      "Taking medications",
      "Avoiding health and safety hazards",
      "Obtaining health care services",
      "Learning how to access emergency services",
      "Maintaining mental health/emotional well-being",
      "Maintaining physical health and fitness",
      "Learning how to get help",
      "Using medical and dental services"
    ]
  },
  {
    title: "Social Activities",
    questions: [
      "Socializing within the household",
      "Participating in recreation/leisure activities with others",
      "Making and maintaining friendships",
      "Communicating with others about personal needs",
      "Using appropriate social skills",
      "Engaging in loving and intimate relationships",
      "Offering assistance/support to others",
      "Socializing outside the household"
    ]
  }
];

const supportLevels = [
  { value: 0, label: "No support needed", description: "Person is independent" },
  { value: 1, label: "Some support", description: "Less than daily support" },
  { value: 2, label: "Regular support", description: "Daily support, but not throughout the day" },
  { value: 3, label: "Extensive support", description: "Daily support in most activities" },
  { value: 4, label: "Pervasive support", description: "Constant, high-intensity support" }
];

const SISTest = () => {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[][]>(
    domains.map(domain => new Array(domain.questions.length).fill(-1))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentDomain][currentQuestion] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    const currentDomainData = domains[currentDomain];
    if (currentQuestion < currentDomainData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDomain < domains.length - 1) {
      setCurrentDomain(currentDomain + 1);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
      setCurrentQuestion(domains[currentDomain - 1].questions.length - 1);
    }
  };

  const calculateScores = () => {
    const domainScores = responses.map(domainResponses => {
      const total = domainResponses.reduce((sum, response) => sum + response, 0);
      const average = total / domainResponses.length;
      return {
        total,
        average: Math.round(average * 100) / 100
      };
    });

    const overallAverage = domainScores.reduce((sum, domain) => sum + domain.average, 0) / domainScores.length;
    
    return {
      domainScores,
      overallAverage: Math.round(overallAverage * 100) / 100
    };
  };

  const getSupportLevel = (score: number) => {
    if (score <= 1) return 'Limited Support Needs';
    if (score <= 2) return 'Intermittent Support Needs';
    if (score <= 3) return 'Extensive Support Needs';
    return 'Pervasive Support Needs';
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
    const scores = calculateScores();
    const supportLevel = getSupportLevel(scores.overallAverage);

    try {
      const { error } = await supabase
        .from('psychological_test_results')
        .insert({
          user_id: user.id,
          test_type: 'SIS',
          test_name: 'Supports Intensity Scale',
          responses: responses,
          total_score: Math.round(scores.overallAverage * 10), // Scale for storage
          severity_level: supportLevel,
          additional_data: scores
        });

      if (error) throw error;

      toast({
        title: "Assessment Completed",
        description: "Your SIS results have been saved successfully."
      });

      navigate('/psych-tests/results', { 
        state: { 
          testType: 'SIS',
          score: Math.round(scores.overallAverage * 10),
          severity: supportLevel,
          responses: responses,
          domainScores: scores.domainScores
        }
      });
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestions = domains.reduce((sum, domain) => sum + domain.questions.length, 0);
  const answeredQuestions = currentDomain * domains[0].questions.length + currentQuestion + 1;
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  const isLastQuestion = currentDomain === domains.length - 1 && 
                        currentQuestion === domains[currentDomain].questions.length - 1;
  const canProceed = responses[currentDomain][currentQuestion] !== -1;
  
  const currentDomainData = domains[currentDomain];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Supports Intensity Scale (SIS)
            <span className="text-sm font-normal">
              {currentDomainData.title}: {currentQuestion + 1} of {currentDomainData.questions.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-chetna-primary">
                {currentDomainData.title}
              </h3>
              <p className="text-base mb-4">
                Rate the level of support needed for the following activity:
              </p>
              <p className="text-xl font-medium mb-6">
                {currentDomainData.questions[currentQuestion]}
              </p>
            </div>

            <RadioGroup
              value={responses[currentDomain][currentQuestion]?.toString()}
              onValueChange={(value) => handleResponse(parseInt(value))}
            >
              {supportLevels.map((level) => (
                <div key={level.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={level.value.toString()} id={`level-${level.value}`} className="mt-1" />
                  <Label htmlFor={`level-${level.value}`} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentDomain === 0 && currentQuestion === 0}
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={submitTest}
                  disabled={!canProceed || isSubmitting}
                  className="chetna-button"
                >
                  {isSubmitting ? "Submitting..." : "Complete Assessment"}
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

            <div className="text-center text-sm text-gray-500">
              Domain {currentDomain + 1} of {domains.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SISTest;
