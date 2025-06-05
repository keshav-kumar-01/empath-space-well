
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Calendar as CalendarIcon, Clock, MessageCircle, Phone, Video } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";

const BookSession = () => {
  const { psychologistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [consultationMode, setConsultationMode] = useState("");
  const [notes, setNotes] = useState("");

  const { data: psychologist, isLoading } = useQuery({
    queryKey: ["psychologist", psychologistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologists")
        .select("*")
        .eq("id", psychologistId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: availability } = useQuery({
    queryKey: ["availability", psychologistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologist_availability")
        .select("*")
        .eq("psychologist_id", psychologistId)
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  const { data: bookedSessions } = useQuery({
    queryKey: ["booked-sessions", psychologistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .select("session_date, start_time, end_time")
        .eq("psychologist_id", psychologistId)
        .in("status", ["pending", "confirmed"]);

      if (error) throw error;
      return data;
    },
  });

  const bookSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Session Booked Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["booked-sessions"] });
      navigate("/profile");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your session. Please try again.",
        variant: "destructive",
      });
      console.error("Booking error:", error);
    },
  });

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);

    if (dayAvailability.length === 0) return [];

    const timeSlots = [];
    for (const slot of dayAvailability) {
      const startTime = new Date(`2000-01-01T${slot.start_time}`);
      const endTime = new Date(`2000-01-01T${slot.end_time}`);
      
      for (let time = new Date(startTime); time < endTime; time.setHours(time.getHours() + 1)) {
        const timeString = time.toTimeString().slice(0, 5);
        const endTimeString = new Date(time.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);
        
        // Check if this time slot is already booked
        const isBooked = bookedSessions?.some(session => 
          session.session_date === format(selectedDate, 'yyyy-MM-dd') &&
          session.start_time === timeString
        );

        if (!isBooked) {
          timeSlots.push({
            start: timeString,
            end: endTimeString,
            display: `${timeString} - ${endTimeString}`
          });
        }
      }
    }

    return timeSlots;
  };

  const handleBookSession = () => {
    if (!user || !selectedDate || !selectedTime || !consultationMode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const sessionData = {
      user_id: user.id,
      psychologist_id: psychologistId,
      session_date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: selectedTime,
      end_time: new Date(new Date(`2000-01-01T${selectedTime}`).getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5),
      consultation_mode: consultationMode,
      notes: notes,
      total_amount: psychologist?.hourly_rate || 0,
      status: 'pending'
    };

    bookSessionMutation.mutate(sessionData);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "chat": return <MessageCircle className="h-4 w-4" />;
      case "audio": return <Phone className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return null;
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // Allow booking up to 30 days in advance
    
    return isBefore(date, today) || isAfter(date, maxDate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!psychologist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-red-600">Psychologist not found</p>
            <Button onClick={() => navigate("/psychologists")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Psychologists
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate("/psychologists")} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Psychologists
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Psychologist Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={psychologist.profile_image_url} alt={psychologist.name} />
                  <AvatarFallback className="bg-chetna-primary text-white text-xl">
                    {psychologist.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{psychologist.name}</CardTitle>
                <CardDescription>
                  {psychologist.experience_years} years of experience
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{psychologist.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-500">({psychologist.total_reviews || 0} reviews)</span>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {psychologist.specializations?.map((spec: string) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Languages</h4>
                  <p className="text-sm text-gray-600">
                    {psychologist.languages?.join(', ')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Hourly Rate</h4>
                  <p className="text-lg font-semibold text-chetna-primary">
                    ${psychologist.hourly_rate}/hour
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-gray-600">{psychologist.bio}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Book a Session
                </CardTitle>
                <CardDescription>
                  Choose your preferred date, time, and consultation mode
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Consultation Mode */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Consultation Mode
                  </Label>
                  <RadioGroup value={consultationMode} onValueChange={setConsultationMode}>
                    {psychologist.consultation_modes?.map((mode: string) => (
                      <div key={mode} className="flex items-center space-x-2">
                        <RadioGroupItem value={mode} id={mode} />
                        <Label htmlFor={mode} className="flex items-center gap-2 cursor-pointer">
                          {getModeIcon(mode)}
                          <span className="capitalize">{mode}</span>
                          {mode === "video" && <span className="text-sm text-gray-500">(Recommended)</span>}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Date Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Select Date
                  </Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Available Time Slots
                    </Label>
                    {availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <Button
                            key={slot.start}
                            variant={selectedTime === slot.start ? "default" : "outline"}
                            onClick={() => setSelectedTime(slot.start)}
                            className="h-auto p-3"
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{slot.display}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No available time slots for this date. Please select another date.
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-base font-medium mb-3 block">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Share any specific concerns or topics you'd like to discuss..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Summary */}
                {selectedDate && selectedTime && consultationMode && (
                  <div className="bg-chetna-bubble/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Session Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      <p><strong>Time:</strong> {selectedTime} - {new Date(new Date(`2000-01-01T${selectedTime}`).getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5)}</p>
                      <p><strong>Mode:</strong> {consultationMode.charAt(0).toUpperCase() + consultationMode.slice(1)}</p>
                      <p><strong>Duration:</strong> 60 minutes</p>
                      <p><strong>Cost:</strong> ${psychologist.hourly_rate}</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedTime || !consultationMode || bookSessionMutation.isPending}
                  className="w-full bg-chetna-primary hover:bg-chetna-primary/90"
                  size="lg"
                >
                  {bookSessionMutation.isPending ? "Booking..." : "Book Session"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookSession;
