
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, MessageSquare, Calendar as CalendarIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isToday, isTomorrow } from "date-fns";

interface BookingModalProps {
  psychologist: any;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ psychologist, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("video_call");
  const [clientNotes, setClientNotes] = useState<string>("");

  const { data: availability } = useQuery({
    queryKey: ['psychologist-availability', psychologist.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychologist_availability')
        .select('*')
        .eq('psychologist_id', psychologist.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!psychologist.id
  });

  const { data: bookedSessions } = useQuery({
    queryKey: ['booked-sessions', psychologist.id, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time')
        .eq('psychologist_id', psychologist.id)
        .eq('session_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['scheduled', 'ongoing']);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDate
  });

  const bookSessionMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedDate || !selectedTimeSlot) {
        throw new Error('Missing required fields');
      }

      const [startTime, endTime] = selectedTimeSlot.split('-');
      
      const { error } = await supabase
        .from('therapy_sessions')
        .insert({
          psychologist_id: psychologist.id,
          client_id: user.id,
          session_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: startTime.trim(),
          end_time: endTime.trim(),
          session_type: sessionType,
          client_notes: clientNotes || null,
          total_amount: psychologist.hourly_rate,
          meeting_link: sessionType === 'video_call' ? `https://meet.example.com/${Date.now()}` : null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Session booked successfully!",
        description: "You'll receive a confirmation email shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ['booked-sessions'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: "Unable to book the session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedTimeSlot("");
    setSessionType("video_call");
    setClientNotes("");
  };

  const generateTimeSlots = () => {
    if (!selectedDate || !availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(av => av.day_of_week === dayOfWeek);
    
    if (!dayAvailability) return [];

    const slots = [];
    const startHour = parseInt(dayAvailability.start_time.split(':')[0]);
    const endHour = parseInt(dayAvailability.end_time.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const timeSlot = `${startTime}-${endTime}`;
      
      const isBooked = bookedSessions?.some(session => 
        session.start_time === startTime
      );

      if (!isBooked) {
        slots.push(timeSlot);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Session with {psychologist.name}</DialogTitle>
          <DialogDescription>
            Choose your preferred date, time, and session type.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                className="rounded-md border"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Session Type</h3>
              <RadioGroup value={sessionType} onValueChange={setSessionType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video_call" id="video_call" />
                  <Label htmlFor="video_call" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text_chat" id="text_chat" />
                  <Label htmlFor="text_chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Text Chat
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Additional Notes (Optional)</h3>
              <Textarea
                placeholder="Any specific concerns or topics you'd like to discuss..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="font-semibold mb-3">
                Available Times - {selectedDate ? getDateLabel(selectedDate) : 'Select a date'}
              </h3>
              
              {timeSlots.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-muted-foreground">
                      No available time slots for this date
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot.replace('-', ' - ')}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Therapist:</span>
                  <span className="font-medium">{psychologist.name}</span>
                </div>
                
                {selectedDate && (
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {format(selectedDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {selectedTimeSlot && (
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">
                      {selectedTimeSlot.replace('-', ' - ')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Session Type:</span>
                  <span className="font-medium">
                    {sessionType === 'video_call' ? 'Video Call' : 'Text Chat'}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span>Total:</span>
                  <span>${psychologist.hourly_rate}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => bookSessionMutation.mutate()}
                disabled={!selectedDate || !selectedTimeSlot || bookSessionMutation.isPending}
                className="flex-1"
              >
                {bookSessionMutation.isPending ? 'Booking...' : 'Book Session'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
