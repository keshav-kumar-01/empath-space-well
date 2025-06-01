
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share } from 'lucide-react';

const TestResults = () => {
  const location = useLocation();
  const { testType, score, severity, responses, functionalImpairment } = location.state || {};

  if (!testType) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-4">
              It looks like you haven't completed a test yet.
            </p>
            <Link to="/psych-tests">
              <Button className="chetna-button">Take a Test</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low anxiety':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'mild':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'moderate':
      case 'moderately severe':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRecommendations = (testType: string, severity: string) => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('minimal') || severityLower.includes('low')) {
      return [
        "Your scores suggest minimal symptoms. Continue with self-care practices.",
        "Maintain regular exercise, good sleep habits, and stress management.",
        "Consider mindfulness or meditation practices for ongoing wellness."
      ];
    } else if (severityLower.includes('mild')) {
      return [
        "Your scores suggest mild symptoms that may benefit from attention.",
        "Consider lifestyle changes like regular exercise and stress reduction.",
        "Monitor your symptoms and consider talking to a counselor if they persist.",
        "Practice relaxation techniques and maintain social connections."
      ];
    } else if (severityLower.includes('moderate')) {
      return [
        "Your scores suggest moderate symptoms that warrant professional attention.",
        "Consider speaking with a mental health professional for evaluation.",
        "Explore therapy options such as cognitive-behavioral therapy (CBT).",
        "Discuss with your doctor whether medication might be helpful."
      ];
    } else {
      return [
        "Your scores suggest severe symptoms that require immediate professional attention.",
        "Please contact a mental health professional as soon as possible.",
        "Consider calling a crisis helpline if you're having thoughts of self-harm.",
        "Don't wait - seeking help is a sign of strength, not weakness."
      ];
    }
  };

  const recommendations = getRecommendations(testType, severity);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/psych-tests" className="inline-flex items-center gap-2 text-chetna-primary hover:text-chetna-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Link>
          </div>

          <div className="grid gap-6">
            {/* Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {testType} Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Your Score</h3>
                    <div className="text-3xl font-bold text-chetna-primary mb-2">
                      {score}
                    </div>
                    <Badge className={getSeverityColor(severity)}>
                      {severity}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Test Details</h3>
                    <p className="text-gray-600">
                      Completed: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Questions answered: {responses?.length || 0}
                    </p>
                    {functionalImpairment && (
                      <p className="text-gray-600 mt-2">
                        Functional impact: {functionalImpairment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-chetna-primary mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-orange-700">
                  These results are for educational purposes only and should not be used as a substitute 
                  for professional medical advice, diagnosis, or treatment. If you're experiencing mental 
                  health concerns, please consult with a qualified healthcare provider.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Results
              </Button>
              <Button variant="outline" className="gap-2">
                <Share className="h-4 w-4" />
                Share with Provider
              </Button>
              <Link to="/psych-tests">
                <Button className="chetna-button">
                  Take Another Test
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestResults;
