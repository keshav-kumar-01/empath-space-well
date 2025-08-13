
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CPTResult {
  reactionTimes: number[];
  omissionErrors: number;
  commissionErrors: number;
  totalTargets: number;
  totalNonTargets: number;
}

const CPTTest = () => {
  const [phase, setPhase] = useState<'instructions' | 'practice' | 'test' | 'completed'>('instructions');
  const [currentStimulus, setCurrentStimulus] = useState<string>('');
  const [isTarget, setIsTarget] = useState<boolean>(false);
  const [stimulusStartTime, setStimulusStartTime] = useState<number>(0);
  const [trialCount, setTrialCount] = useState<number>(0);
  const [results, setResults] = useState<CPTResult>({
    reactionTimes: [],
    omissionErrors: 0,
    commissionErrors: 0,
    totalTargets: 0,
    totalNonTargets: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const TOTAL_TRIALS = 100;
  const TARGET_PROBABILITY = 0.3;
  const STIMULUS_DURATION = 500; // 500ms
  const INTER_STIMULUS_INTERVAL = 1500; // 1.5s

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const targetLetter = 'X';

  const generateStimulus = useCallback(() => {
    const isTargetTrial = Math.random() < TARGET_PROBABILITY;
    if (isTargetTrial) {
      return { stimulus: targetLetter, isTarget: true };
    } else {
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      return { stimulus: randomLetter, isTarget: false };
    }
  }, []);

  const handleResponse = useCallback(() => {
    if (!showStimulus) return;

    const reactionTime = Date.now() - stimulusStartTime;
    
    setResults(prev => {
      const newResults = { ...prev };
      
      if (isTarget) {
        // Correct hit
        newResults.reactionTimes.push(reactionTime);
      } else {
        // False alarm (commission error)
        newResults.commissionErrors++;
      }
      
      return newResults;
    });
  }, [showStimulus, stimulusStartTime, isTarget]);

  const nextTrial = useCallback(() => {
    // Increment trial count first and check if we've reached the limit
    const currentTrial = trialCount + 1;
    setTrialCount(currentTrial);
    
    if (currentTrial > TOTAL_TRIALS) {
      setPhase('completed');
      return;
    }

    const { stimulus, isTarget: targetTrial } = generateStimulus();
    
    setResults(prev => ({
      ...prev,
      totalTargets: prev.totalTargets + (targetTrial ? 1 : 0),
      totalNonTargets: prev.totalNonTargets + (targetTrial ? 0 : 1)
    }));

    // Show fixation cross
    setCurrentStimulus('+');
    setShowStimulus(false);
    
    setTimeout(() => {
      // Show stimulus
      setCurrentStimulus(stimulus);
      setIsTarget(targetTrial);
      setShowStimulus(true);
      setStimulusStartTime(Date.now());
      
      // Track missed targets (omission errors)
      const missTimeout = setTimeout(() => {
        if (targetTrial) {
          setResults(prev => ({
            ...prev,
            omissionErrors: prev.omissionErrors + 1
          }));
        }
      }, STIMULUS_DURATION);

      setTimeout(() => {
        clearTimeout(missTimeout);
        setShowStimulus(false);
        
        setTimeout(() => {
          nextTrial();
        }, INTER_STIMULUS_INTERVAL - STIMULUS_DURATION);
      }, STIMULUS_DURATION);
    }, 500);
  }, [trialCount, generateStimulus]);

  const startTest = () => {
    setPhase('test');
    setTrialCount(0);
    setResults({
      reactionTimes: [],
      omissionErrors: 0,
      commissionErrors: 0,
      totalTargets: 0,
      totalNonTargets: 0
    });
    nextTrial();
  };

  const calculatePerformanceMetrics = () => {
    const avgReactionTime = results.reactionTimes.length > 0 
      ? results.reactionTimes.reduce((a, b) => a + b, 0) / results.reactionTimes.length 
      : 0;
    
    const hitRate = results.totalTargets > 0 
      ? ((results.totalTargets - results.omissionErrors) / results.totalTargets) * 100 
      : 0;
    
    const falseAlarmRate = results.totalNonTargets > 0 
      ? (results.commissionErrors / results.totalNonTargets) * 100 
      : 0;

    return {
      avgReactionTime: Math.round(avgReactionTime),
      hitRate: Math.round(hitRate * 100) / 100,
      falseAlarmRate: Math.round(falseAlarmRate * 100) / 100,
      omissionErrors: results.omissionErrors,
      commissionErrors: results.commissionErrors
    };
  };

  const getPerformanceLevel = (metrics: ReturnType<typeof calculatePerformanceMetrics>) => {
    if (metrics.hitRate >= 85 && metrics.falseAlarmRate <= 15 && metrics.avgReactionTime <= 600) {
      return 'Good';
    } else if (metrics.hitRate >= 70 && metrics.falseAlarmRate <= 30) {
      return 'Average';
    } else {
      return 'Needs Attention';
    }
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
    const metrics = calculatePerformanceMetrics();
    const performanceLevel = getPerformanceLevel(metrics);

    try {
      const { error } = await supabase
        .from('psychological_test_results')
        .insert({
          user_id: user.id,
          test_type: 'CPT',
          test_name: 'Continuous Performance Test',
          responses: results as any,
          total_score: Math.round(metrics.hitRate),
          severity_level: performanceLevel,
          additional_data: metrics as any
        });

      if (error) throw error;

      toast({
        title: "Test Completed",
        description: "Your CPT results have been saved successfully."
      });

      // Fix navigation path
      navigate('/test-results', { 
        state: { 
          testType: 'CPT',
          score: Math.round(metrics.hitRate),
          severity: performanceLevel,
          responses: results,
          metrics: metrics
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && phase === 'test') {
        event.preventDefault();
        handleResponse();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResponse, phase]);

  const progress = (trialCount / TOTAL_TRIALS) * 100;

  if (phase === 'instructions') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Continuous Performance Test (CPT)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Instructions</h3>
                <div className="space-y-3 text-gray-700">
                  <p>You will see letters appearing one at a time on the screen.</p>
                  <p>Your task is to press the <strong>SPACEBAR</strong> as quickly as possible whenever you see the letter <strong className="text-2xl text-chetna-primary">X</strong>.</p>
                  <p><strong>Do NOT press</strong> the spacebar for any other letters.</p>
                  <p>Letters will appear for a brief moment, so pay close attention and respond quickly.</p>
                  <p>The test will take about 5 minutes to complete.</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Remember:</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Press SPACEBAR only when you see the letter "X"</li>
                  <li>• Respond as quickly and accurately as possible</li>
                  <li>• Stay focused throughout the entire test</li>
                </ul>
              </div>

              <Button onClick={startTest} className="w-full chetna-button">
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'test') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Continuous Performance Test
              <span className="text-sm font-normal">
                {trialCount} / {TOTAL_TRIALS}
              </span>
            </CardTitle>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-96">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 mb-4">
                  Press SPACEBAR when you see the letter "X"
                </p>
              </div>
              
              <div className="flex items-center justify-center w-32 h-32 border-2 border-gray-300 rounded-lg bg-white">
                <span className="text-6xl font-mono font-bold text-gray-800">
                  {currentStimulus}
                </span>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  Focus on the center and respond quickly to "X"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'completed') {
    const metrics = calculatePerformanceMetrics();
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Your Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Hit Rate</p>
                    <p className="text-2xl font-bold text-blue-800">{metrics.hitRate}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Avg Reaction Time</p>
                    <p className="text-2xl font-bold text-green-800">{metrics.avgReactionTime}ms</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">False Alarms</p>
                    <p className="text-2xl font-bold text-orange-800">{metrics.commissionErrors}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">Missed Targets</p>
                    <p className="text-2xl font-bold text-red-800">{metrics.omissionErrors}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={submitTest} 
                disabled={isSubmitting}
                className="w-full chetna-button"
              >
                {isSubmitting ? "Saving Results..." : "Save Results"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default CPTTest;
