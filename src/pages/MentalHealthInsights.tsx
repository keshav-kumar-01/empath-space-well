
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
    <div className="container mx-auto p-6 md:p-8 lg:p-10 space-y-10 max-w-7xl">
      <header className="text-center mb-10 space-y-3">
        <h1 id="insights-title" className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mental Health Insights
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered analysis of your mental wellness patterns and progress tracking
        </p>
      </header>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Wellness overview statistics</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Overall Wellness Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-4xl font-bold text-primary" aria-label={`Overall wellness score is ${calculateOverallWellness().toFixed(0)} percent`}>
                {calculateOverallWellness().toFixed(0)}%
              </div>
              <Progress value={calculateOverallWellness()} className="h-3" aria-label="Wellness score progress bar" />
              <p className="text-sm text-muted-foreground">Based on recent mood & activity data</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Weekly Mood Average</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400" aria-label={`Weekly mood average is ${moodData ? (moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length).toFixed(1) : '0'} out of 10`}>
                {moodData ? (moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length).toFixed(1) : '0'}/10
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                <span>Trending upward</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Active Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400" aria-label={`${insights?.filter(i => !i.is_read).length || 0} new recommendations available`}>
                {insights?.filter(i => !i.is_read).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">New recommendations available</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="trends-heading">
        <h2 id="trends-heading" className="sr-only">Mood and test score trends</h2>
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                Mood Trends (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                Test Score Comparisons
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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
      </section>

      <section aria-labelledby="insights-heading">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl" id="insights-heading">
              <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-5" role="list" aria-label="AI generated insights">
              {insights?.map((insight) => (
                <li 
                  key={insight.id} 
                  className="border rounded-lg p-5 hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-primary"
                  role="article"
                  aria-label={`Insight: ${insight.title}`}
                >
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
                </li>
              ))}

              {(!insights || insights.length === 0) && (
                <div className="text-center py-12" role="status">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">No insights yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Keep using the app to generate personalized mental health insights!
                  </p>
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MentalHealthInsights;
