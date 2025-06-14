
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, Star, Users, Stethoscope, Heart, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  experience: string;
  languages: string[];
  avatar_url?: string;
  fee: string;
  available: boolean;
  bio?: string;
  total_reviews?: number;
}

interface Appointment {
  id: string;
  therapist_id: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  status: string;
  therapist?: Therapist;
}

const AppointmentBooking: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');

  // Fetch therapists from Supabase
  const { data: therapists = [], isLoading: therapistsLoading } = useQuery({
    queryKey: ['therapists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('available', true)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Therapist[];
    }
  });

  // Fetch user's appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          therapist:therapists(*)
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!user?.id
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: {
      therapist_id: string;
      appointment_date: string;
      appointment_time: string;
      session_type: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          ...appointmentData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment booked! 📅",
        description: "You'll receive a confirmation email shortly",
      });
      // Reset form
      setSelectedTime('');
      setSelectedTherapist('');
      setSessionType('');
    },
    onError: (error) => {
      console.error('Appointment booking error:', error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  });

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
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedTherapist || !sessionType) {
      toast({
        title: "Please fill all fields",
        description: "Select date, time, therapist, and session type",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate({
      therapist_id: selectedTherapist,
      appointment_date: selectedDate.toISOString().split('T')[0],
      appointment_time: selectedTime,
      session_type: sessionType,
    });
  };

  if (therapistsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">Loading therapists...</div>
        </main>
        <Footer />
      </div>
    );
  }

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

        {/* Show user's existing appointments */}
        {appointments.length > 0 && (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-chetna-primary" />
                Your Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-semibold">{appointment.therapist?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {appointment.appointment_date} at {appointment.appointment_time}
                      </p>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                          <AvatarImage src={therapist.avatar_url} alt={therapist.name} />
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
                            {therapist.bio && (
                              <p className="text-sm text-muted-foreground mt-2">{therapist.bio}</p>
                            )}
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
              disabled={createAppointmentMutation.isPending}
              className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {createAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppointmentBooking;
