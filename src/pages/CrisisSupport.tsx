
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, MessageCircle, MapPin, Clock, Shield, Heart, Users, Headphones } from 'lucide-react';

const CrisisSupport: React.FC = () => {
  const { t } = useTranslation();

  const emergencyContacts = [
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      description: "24/7 toll-free mental health helpline by Ministry of Health",
      availability: "24/7",
      icon: Phone,
      color: "text-red-500"
    },
    {
      name: "Vandrevala Foundation",
      number: "9999-666-555",
      description: "Crisis intervention and suicide prevention",
      availability: "24/7",
      icon: Shield,
      color: "text-blue-500"
    },
    {
      name: "iCall Helpline",
      number: "9152987821",
      description: "Counseling and mental health support",
      availability: "Mon-Sat, 8 AM-10 PM",
      icon: Headphones,
      color: "text-green-500"
    },
    {
      name: "NIMHANS Helpline",
      number: "080-26995000",
      description: "National Institute of Mental Health",
      availability: "Mon-Fri, 9 AM-5 PM",
      icon: Heart,
      color: "text-purple-500"
    }
  ];

  const cityHelplines = [
    { city: "Mumbai", name: "Sneha India", number: "044-24640050" },
    { city: "Hyderabad", name: "Roshni Helpline", number: "040-66202000" },
    { city: "Chennai", name: "Sneha Suicide Prevention", number: "044-24640050" },
    { city: "Delhi", name: "Sumaitri", number: "011-23389090" },
    { city: "Bangalore", name: "Parivarthan", number: "0766-2410502" },
    { city: "Kolkata", name: "Sahai", number: "080-25497777" }
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Crisis Support - Chetna_AI</title>
        <meta name="description" content="Immediate crisis support and emergency mental health resources" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Crisis Support 🆘
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immediate help and resources for mental health emergencies
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>If you're having thoughts of self-harm or suicide, please reach out immediately.</strong> 
            You're not alone, and help is available 24/7.
          </AlertDescription>
        </Alert>

        {/* National Helplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {emergencyContacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <Card key={index} className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className={`h-6 w-6 ${contact.color}`} />
                    {contact.name}
                  </CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.availability}</span>
                    </div>
                    <Button 
                      onClick={() => handleEmergencyCall(contact.number)}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-opacity"
                      size="lg"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call {contact.number}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* City-wise Helplines */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-chetna-primary" />
              City-wise Helplines
            </CardTitle>
            <CardDescription>
              Local mental health support services across India
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityHelplines.map((helpline, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <h4 className="font-semibold text-chetna-primary">{helpline.city}</h4>
                  <p className="text-sm text-muted-foreground">{helpline.name}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEmergencyCall(helpline.number)}
                    className="mt-2 w-full"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {helpline.number}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Planning */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-chetna-secondary" />
              Crisis Safety Plan
            </CardTitle>
            <CardDescription>
              Steps to take when you're feeling overwhelmed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-chetna-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Recognize Warning Signs</h4>
                  <p className="text-sm text-muted-foreground">Notice thoughts, emotions, or situations that typically lead to crisis</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-chetna-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Use Coping Strategies</h4>
                  <p className="text-sm text-muted-foreground">Deep breathing, grounding techniques, or calling a friend</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-chetna-primary text-white flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Reach Out for Support</h4>
                  <p className="text-sm text-muted-foreground">Contact trusted friends, family, or professionals</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Get Professional Help</h4>
                  <p className="text-sm text-muted-foreground">Call crisis helplines or visit emergency services if needed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CrisisSupport;
