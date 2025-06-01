
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Focus, User, Users, Clock } from 'lucide-react';

const testCategories = [
  {
    id: 'anxiety',
    title: 'Feeling Anxious or Stressed',
    description: 'For users who feel nervous, worried, or stressed',
    icon: Heart,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    tests: [
      {
        id: 'gad7',
        name: 'GAD-7',
        fullName: 'Generalized Anxiety Disorder - 7',
        duration: '5 mins',
        questions: 7,
        description: 'Screens for generalized anxiety disorder'
      },
      {
        id: 'bai',
        name: 'BAI',
        fullName: 'Beck Anxiety Inventory',
        duration: '10 mins',
        questions: 21,
        description: 'Measures severity of anxiety symptoms'
      }
    ]
  },
  {
    id: 'depression',
    title: 'Feeling Low or Depressed',
    description: 'For users experiencing sadness, low mood',
    icon: Brain,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    tests: [
      {
        id: 'phq9',
        name: 'PHQ-9',
        fullName: 'Patient Health Questionnaire',
        duration: '5 mins',
        questions: 9,
        description: 'Screens for depression'
      },
      {
        id: 'bdi2',
        name: 'BDI-II',
        fullName: 'Beck Depression Inventory II',
        duration: '15 mins',
        questions: 21,
        description: 'Assesses severity of depression'
      }
    ]
  },
  {
    id: 'attention',
    title: 'Trouble Focusing / Attention Issues',
    description: 'For users suspecting ADHD or concentration issues',
    icon: Focus,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    tests: [
      {
        id: 'cpt',
        name: 'CPT',
        fullName: 'Continuous Performance Test',
        duration: '5 mins',
        questions: 'Interactive',
        description: 'Tests attention and focus abilities'
      }
    ]
  },
  {
    id: 'personality',
    title: 'Understanding Personality',
    description: 'For users curious about personality insights',
    icon: User,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    tests: [
      {
        id: 'mmpi2',
        name: 'MMPI-2',
        fullName: 'Minnesota Multiphasic Personality Inventory',
        duration: '20 mins',
        questions: 50,
        description: 'Comprehensive personality assessment (shortened version)'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support Needs',
    description: 'For users or caregivers wanting to assess support needs',
    icon: Users,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    tests: [
      {
        id: 'sis',
        name: 'SIS',
        fullName: 'Supports Intensity Scale',
        duration: '25 mins',
        questions: 49,
        description: 'Assesses support needs for daily living'
      }
    ]
  }
];

const PsychTests = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
              Psychological Assessment Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Take scientifically validated psychological tests to better understand your mental health, 
              personality, and support needs. All results are private and stored securely.
            </p>
          </div>

          <div className="grid gap-8">
            {testCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription className="text-base">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.tests.map((test) => (
                        <Card key={test.id} className="border-2 hover:border-chetna-primary/30 transition-colors">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">{test.name}</Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {test.duration}
                              </div>
                            </div>
                            <CardTitle className="text-lg">{test.fullName}</CardTitle>
                            <CardDescription>{test.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {typeof test.questions === 'number' ? `${test.questions} questions` : test.questions}
                              </span>
                              <Link to={`/psych-tests/${test.id}`}>
                                <Button size="sm" className="chetna-button">
                                  Take Test
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-chetna-primary/5 border-chetna-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Important Note</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  These tests are for educational and self-assessment purposes only. 
                  They are not a substitute for professional mental health evaluation or diagnosis. 
                  If you're experiencing mental health concerns, please consult with a qualified healthcare provider.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PsychTests;
