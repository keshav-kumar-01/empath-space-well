
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, MapPin, Star, Video, Phone, Users, Stethoscope, Heart, Brain } from 'lucide-react';

const AppointmentBooking: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');

  const therapists = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialties: ['Anxiety', 'Depression', 'CBT'],
      rating: 4.9,
      experience: '8+ years',
      languages: ['Hindi', 'English'],
      avatar: '/placeholder.svg',
      fee: '₹1,500',
      available: true
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialties: ['Trauma', 'PTSD', 'Family Therapy'],
      rating: 4.8,
      experience: '12+ years',
      languages: ['Hindi', 'English', 'Punjabi'],
      avatar: '/placeholder.svg',
      fee: '₹2,000',
      available: true
    },
    {
      id: '3',
      name: 'Dr. Meera Patel',
      specialties: ['Couples Therapy', 'Relationships'],
      rating: 4.7,
      experience: '6+ years',
      languages: ['Hindi', 'English', 'Gujarati'],
      avatar: '/placeholder.svg',
      fee: '₹1,800',
      available: false
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const sessionTypes = [
    { value: 'individual', label: 'Individual Therapy', icon: Users, description: 'One-on-one session' },
    { value: 'couples', label: 'Couples Therapy', icon: Heart, description: 'For couples and partners' },
    { value: 'group', label: 'Group Therapy', icon: Users, description: 'Small group sessions' },
    { value: 'consultation', label: 'Consultation', icon: Stethoscope, description: 'Initial assessment' }
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedTherapist || !sessionType) {
      toast({
        title: "Please fill all fields",
        description: "Select date, time, therapist, and session type",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment booked! 📅",
      description: "You'll receive a confirmation email shortly",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Book Appointment - Chetna_AI</title>
        <meta name="description" content="Book therapy sessions with licensed professionals" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            Book an Appointment 🗓️
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with licensed therapists and counselors for professional support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Therapist Selection */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-chetna-primary" />
                  Choose Your Therapist
                </CardTitle>
                <CardDescription>
                  Select from our licensed mental health professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {therapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTherapist === therapist.id
                          ? 'border-chetna-primary bg-chetna-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-chetna-primary/50'
                      } ${!therapist.available ? 'opacity-50' : ''}`}
                      onClick={() => therapist.available && setSelectedTherapist(therapist.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={therapist.avatar} alt={therapist.name} />
                          <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{therapist.name}</h4>
                              <p className="text-sm text-muted-foreground">{therapist.experience}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-chetna-primary">{therapist.fee}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                <span className="text-sm">{therapist.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {therapist.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Languages: {therapist.languages.join(', ')}
                            </p>
                          </div>
                          {!therapist.available && (
                            <Badge variant="destructive" className="mt-2">
                              Currently Unavailable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Type */}
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-chetna-secondary" />
                  Session Type
                </CardTitle>
                <CardDescription>
                  Choose the type of therapy session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          sessionType === type.value
                            ? 'border-chetna-secondary bg-chetna-secondary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-chetna-secondary/50'
                        }`}
                        onClick={() => setSessionType(type.value)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-chetna-secondary" />
                          <div>
                            <h4 className="font-semibold">{type.label}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date and Time Selection */}
          <div>
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-chetna-primary" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chetna-secondary" />
                  Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-xs"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleBookAppointment}
              className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity"
              size="lg"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppointmentBooking;
