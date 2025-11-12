import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentResult = location.state;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAllResults();
  }, [user, navigate]);

  const fetchAllResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('psychological_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching test results:', error);
        throw error;
      }

      setAllResults(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load test results.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'minimal':
      case 'low anxiety':
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'mild':
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
      case 'moderately severe':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
      case 'needs attention':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTestName = (testType: string) => {
    const testNames: { [key: string]: string } = {
      'GAD-7': 'Generalized Anxiety Disorder - 7',
      'BAI': 'Beck Anxiety Inventory',
      'PHQ-9': 'Patient Health Questionnaire',
      'BDI-II': 'Beck Depression Inventory II',
      'CPT': 'Continuous Performance Test',
      'MMPI-2': 'Minnesota Multiphasic Personality Inventory',
      'SIS': 'Supports Intensity Scale'
    };
    return testNames[testType] || testType;
  };

  if (loading) {
    return (
      <PageLayout>
        <Helmet>
          <title>Loading Test Results | Chetna - Mental Health Assessment</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading your test results...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Test Results | Chetna - Mental Health Assessment</title>
        <meta name="description" content="View your comprehensive psychological test results including anxiety, depression, and cognitive assessments on Chetna platform." />
        <meta name="keywords" content="test results, psychological assessment, mental health tests, GAD-7, PHQ-9, BAI, BDI-II" />
        <link rel="canonical" href="https://chetna.life/test-results" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
            Your Test Results
          </h1>

          {/* Current Test Result (if coming from a test) */}
          {currentResult && (
            <Card className="mb-8 shadow-lg border-chetna-primary/20">
              <CardHeader className="bg-gradient-to-r from-chetna-primary/5 to-chetna-secondary/5">
                <CardTitle className="text-xl text-chetna-primary">
                  Latest Result: {currentResult.testType}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">Test Information</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Test:</strong> {formatTestName(currentResult.testType)}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Score:</strong> {currentResult.score}
                      {currentResult.testType === 'CPT' && '%'}
                    </p>
                    <div className="flex items-center gap-2">
                      <strong>Severity:</strong>
                      <Badge className={getSeverityColor(currentResult.severity)}>
                        {currentResult.severity}
                      </Badge>
                    </div>
                  </div>
                  
                  {currentResult.metrics && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">Performance Metrics</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Hit Rate:</strong> {currentResult.metrics.hitRate}%</p>
                        <p><strong>Avg Reaction Time:</strong> {currentResult.metrics.avgReactionTime}ms</p>
                        <p><strong>False Alarms:</strong> {currentResult.metrics.commissionErrors}</p>
                        <p><strong>Missed Targets:</strong> {currentResult.metrics.omissionErrors}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Previous Results */}
          <Card className="shadow-lg border-chetna-primary/20">
            <CardHeader className="bg-gradient-to-r from-chetna-primary/5 to-chetna-secondary/5">
              <CardTitle className="text-xl text-chetna-primary">All Test Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {allResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No test results found.</p>
                  <Button 
                    onClick={() => navigate('/psych-tests')}
                    className="bg-chetna-primary hover:bg-chetna-primary/90 text-white"
                  >
                    Take Your First Test
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {allResults.map((result) => (
                    <Card key={result.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">{result.test_type}</h4>
                            <p className="text-sm text-gray-600">{formatTestName(result.test_type)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-chetna-primary">
                              {result.total_score}
                              {result.test_type === 'CPT' && '%'}
                            </p>
                            <Badge className={getSeverityColor(result.severity_level)}>
                              {result.severity_level}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate('/psych-tests')}
              className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-8"
            >
              Take Another Test
            </Button>
          </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default TestResultsPage;
