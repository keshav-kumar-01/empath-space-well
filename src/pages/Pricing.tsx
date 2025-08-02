
import React, { useState } from 'react';
import { Check, Star, Phone, Mail, Users, Shield, Zap, Heart, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSimpleSubscription } from '@/hooks/useSimpleSubscription';
import { useAuth } from '@/context/AuthContext';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();
  const { plans, sessionPricing, currentPlan, subscribeToPlan } = useSimpleSubscription();

  const getPrice = (plan: any) => {
    if (plan.monthlyPrice === 0) return 0;
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    if (plan.monthlyPrice === 0) return 0;
    return plan.monthlyPrice - plan.annualPrice;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case 'standard': return Heart;
      case 'extended': return Zap;
      case 'group': return Users;
      case 'crisis': return Shield;
      default: return Heart;
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan?.id === planId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
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
              {plans.map((plan, index) => {
                const price = getPrice(plan);
                const savings = getSavings(plan);
                const popular = plan.name === 'Essential Plan';
                const current = isCurrentPlan(plan.id);
                
                return (
                  <Card key={plan.id} className={`relative transition-all duration-300 hover:shadow-lg ${
                    popular ? 'scale-105 shadow-lg border-chetna-primary/30' : ''
                  } ${current ? 'ring-2 ring-chetna-primary' : ''}`}>
                    {popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-chetna-primary text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    
                    {current && (
                      <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Current Plan
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl font-bold text-chetna-dark dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-chetna-primary">
                          ₹{formatPrice(price)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {isAnnual && plan.monthlyPrice > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            Save ₹{formatPrice(savings)}/month
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-chetna-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full ${
                          current 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : plan.monthlyPrice === 0 
                              ? 'bg-chetna-light hover:bg-chetna-light/90 text-chetna-primary border border-chetna-primary'
                              : 'bg-chetna-primary hover:bg-chetna-primary/90 text-white'
                        }`}
                        onClick={() => !current && subscribeToPlan(plan.id, isAnnual)}
                        disabled={current}
                      >
                        {current 
                          ? 'Current Plan' 
                          : plan.monthlyPrice === 0 
                            ? 'Get Started Free' 
                            : 'Choose Plan'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            {/* Per-Session Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {sessionPricing.map((session, index) => {
                const IconComponent = getSessionIcon(session.id);
                return (
                  <Card key={session.id} className="bg-white border-chetna-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-chetna-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-chetna-primary" />
                      </div>
                      <CardTitle className="text-lg font-bold text-chetna-dark dark:text-white">
                        {session.type}
                      </CardTitle>
                      {session.duration && (
                        <CardDescription className="text-sm text-muted-foreground">
                          {session.duration} minutes
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-chetna-primary mb-3">
                        ₹{formatPrice(session.price)}
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

        {/* Current Subscription Status */}
        {user && currentPlan && (
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm mb-16">
            <h2 className="text-2xl font-bold text-center text-chetna-dark dark:text-white mb-6">
              Your Current Subscription
            </h2>
            <div className="text-center">
              <Badge className="bg-chetna-primary text-white text-lg px-4 py-2 mb-4">
                {currentPlan.name}
              </Badge>
              <p className="text-muted-foreground">
                Free tier - upgrade anytime for more features
              </p>
            </div>
          </div>
        )}

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
