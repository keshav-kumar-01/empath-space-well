
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Star, Phone, Mail, Users, Shield, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const subscriptionPlans = [
    {
      name: "Freemium Foundation",
      monthlyPrice: 0,
      annualPrice: 0,
      color: "bg-chetna-light border-chetna-primary/20",
      buttonColor: "bg-chetna-primary hover:bg-chetna-primary/90",
      popular: false,
      features: [
        "5 AI conversations per month",
        "Basic mood tracking",
        "1 psychological assessment per month",
        "Community access (read-only)",
        "Educational resources"
      ]
    },
    {
      name: "Essential Plan",
      monthlyPrice: 499,
      annualPrice: Math.round(499 * 0.65 * 12),
      color: "bg-white border-chetna-secondary/30",
      buttonColor: "bg-chetna-secondary hover:bg-chetna-secondary/90",
      popular: true,
      features: [
        "Unlimited AI conversations",
        "1 professional session per month",
        "Complete assessment suite",
        "Full community features",
        "Voice therapy access"
      ]
    },
    {
      name: "Growth Plan",
      monthlyPrice: 899,
      annualPrice: Math.round(899 * 0.65 * 12),
      color: "bg-chetna-accent/10 border-chetna-accent/30",
      buttonColor: "bg-chetna-accent hover:bg-chetna-accent/90",
      popular: false,
      features: [
        "2 professional sessions per month",
        "Priority AI support",
        "Advanced analytics",
        "Group therapy access",
        "Email support"
      ]
    },
    {
      name: "Pro Plan",
      monthlyPrice: 1499,
      annualPrice: Math.round(1499 * 0.65 * 12),
      color: "bg-gradient-to-br from-chetna-primary/10 to-chetna-secondary/10 border-chetna-primary/40",
      buttonColor: "bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90",
      popular: false,
      features: [
        "4 professional sessions per month",
        "Dedicated therapist matching",
        "Crisis support access",
        "Phone support",
        "Custom wellness plans"
      ]
    }
  ];

  const sessionPricing = [
    {
      type: "Standard Session",
      duration: "45 minutes",
      price: 799,
      icon: Heart,
      description: "Individual therapy session with certified professionals"
    },
    {
      type: "Extended Session",
      duration: "60 minutes",
      price: 1099,
      icon: Zap,
      description: "Extended therapy session for deeper exploration"
    },
    {
      type: "Group Session",
      duration: "per person",
      price: 399,
      icon: Users,
      description: "Therapeutic group sessions with shared experiences"
    },
    {
      type: "Crisis Support Session",
      duration: "immediate",
      price: 1299,
      icon: Shield,
      description: "Emergency mental health support when you need it most"
    }
  ];

  const getPrice = (plan: typeof subscriptionPlans[0]) => {
    if (plan.monthlyPrice === 0) return 0;
    return isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof subscriptionPlans[0]) => {
    if (plan.monthlyPrice === 0) return 0;
    return plan.monthlyPrice - Math.round(plan.annualPrice / 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Pricing Plans - Chetna AI | Mental Wellness Subscriptions</title>
        <meta name="description" content="Choose the right mental wellness plan for you. Flexible subscription and per-session pricing for AI therapy, professional counseling, and mental health support." />
        <link rel="canonical" href="https://chetna.live/pricing" />
      </Helmet>

      <Header />
      
      <div className="container mx-auto px-4 py-12 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-chetna-dark dark:text-white mb-6">
            Choose Your Mental Health Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Flexible plans designed to support your mental wellness at every stage of your journey
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-chetna-primary font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-chetna-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-chetna-primary font-semibold' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-chetna-accent text-white">
                Save 35%
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="subscriptions" className="text-sm">Subscription Plans</TabsTrigger>
            <TabsTrigger value="sessions" className="text-sm">Per-Session Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {subscriptionPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.color} transition-all duration-300 hover:shadow-lg ${plan.popular ? 'scale-105 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-chetna-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-chetna-dark dark:text-white">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-chetna-primary">
                        ₹{getPrice(plan).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Save ₹{getSavings(plan)}/month
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-chetna-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className={`w-full ${plan.buttonColor} text-white`}>
                      {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            {/* Per-Session Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {sessionPricing.map((session, index) => {
                const IconComponent = session.icon;
                return (
                  <Card key={index} className="bg-white border-chetna-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-chetna-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-chetna-primary" />
                      </div>
                      <CardTitle className="text-lg font-bold text-chetna-dark dark:text-white">
                        {session.type}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {session.duration}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-chetna-primary mb-3">
                        ₹{session.price.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        {session.description}
                      </p>
                      <Button className="w-full bg-chetna-primary hover:bg-chetna-primary/90 text-white">
                        Book Session
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-chetna-dark dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-chetna-primary mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-chetna-primary mb-2">
                What's included in the annual discount?
              </h3>
              <p className="text-muted-foreground text-sm">
                Annual subscribers save 35% on all paid plans. The discount applies to the entire year.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-chetna-primary mb-2">
                Are there any setup fees?
              </h3>
              <p className="text-muted-foreground text-sm">
                No setup fees or hidden charges. You only pay for what you see in your chosen plan.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-chetna-primary mb-2">
                How do professional sessions work?
              </h3>
              <p className="text-muted-foreground text-sm">
                Professional sessions are conducted by certified therapists via video call at your convenience.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-chetna-dark dark:text-white mb-4">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who have transformed their mental wellness with Chetna AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-chetna-primary hover:bg-chetna-primary/90 text-white px-8 py-3">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-chetna-primary text-chetna-primary hover:bg-chetna-primary hover:text-white px-8 py-3">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
