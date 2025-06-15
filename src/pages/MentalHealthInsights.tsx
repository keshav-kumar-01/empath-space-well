
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, BarChart3, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MentalHealthInsights = () => {
  const { data: insights } = useQuery({
    queryKey: ['mental-health-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mental_health_insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: moodData } = useQuery({
    queryKey: ['mood-trends'],
    queryFn: async () => {
      // This would typically come from mood tracker entries
      // For demo, returning mock data
      const mockData = [
        { date: '2024-01-01', mood: 7, anxiety: 3, energy: 6 },
        { date: '2024-01-02', mood: 6, anxiety: 4, energy: 5 },
        { date: '2024-01-03', mood: 8, anxiety: 2, energy: 7 },
        { date: '2024-01-04', mood: 5, anxiety: 6, energy: 4 },
        { date: '2024-01-05', mood: 7, anxiety: 3, energy: 6 },
        { date: '2024-01-06', mood: 9, anxiety: 1, energy: 8 },
        { date: '2024-01-07', mood: 6, anxiety: 4, energy: 5 },
      ];
      return mockData;
    },
  });

  const { data: testResults } = useQuery({
    queryKey: ['test-comparative-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychological_test_results')
        .select('test_type, total_score, severity_level, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'mood_trend': return <TrendingUp className="h-5 w-5" />;
      case 'activity_pattern': return <Activity className="h-5 w-5" />;
      case 'sleep_correlation': return <BarChart3 className="h-5 w-5" />;
      case 'stress_trigger': return <AlertTriangle className="h-5 w-5" />;
      case 'progress_milestone': return <CheckCircle className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const calculateOverallWellness = () => {
    if (!moodData) return 0;
    const avgMood = moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length;
    const avgAnxiety = moodData.reduce((sum, day) => sum + day.anxiety, 0) / moodData.length;
    const avgEnergy = moodData.reduce((sum, day) => sum + day.energy, 0) / moodData.length;
    
    // Calculate wellness score (mood + energy - anxiety) / 2, normalized to 0-100
    return Math.max(0, Math.min(100, ((avgMood + avgEnergy - avgAnxiety) / 2) * 10));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Mental Health Insights</h1>
        <p className="text-gray-600">AI-powered analysis of your mental wellness patterns</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Wellness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {calculateOverallWellness().toFixed(0)}%
            </div>
            <Progress value={calculateOverallWellness()} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">Based on recent mood & activity data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Mood Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {moodData ? (moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length).toFixed(1) : '0'}/10
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              Trending upward
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {insights?.filter(i => !i.is_read).length || 0}
            </div>
            <p className="text-xs text-gray-500">New recommendations available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Trends (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Test Score Comparisons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testResults?.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test_type" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_score" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {getInsightIcon(insight.insight_type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.severity_level && (
                      <Badge className={getSeverityColor(insight.severity_level)}>
                        {insight.severity_level}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                
                {insight.data_points && Object.keys(insight.data_points as any).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Data Points:</h5>
                    <div className="text-sm text-gray-600">
                      {JSON.stringify(insight.data_points, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!insights || insights.length === 0) && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
                <p className="text-gray-600">
                  Keep using the app to generate personalized mental health insights!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthInsights;
