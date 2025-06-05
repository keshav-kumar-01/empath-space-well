
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MessageCircle, Phone, Video, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO, isPast, isFuture } from "date-fns";
import { useNavigate } from "react-router-dom";

interface SessionWithPsychologist {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  consultation_mode: string;
  status: string;
  notes?: string;
  session_url?: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  psychologist: {
    id: string;
    name: string;
    profile_image_url?: string;
    specializations: string[];
  };
}

const MySessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["my-sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("therapy_sessions")
        .select(`
          *,
          psychologist:psychologists(
            id,
            name,
            profile_image_url,
            specializations
          )
        `)
        .eq("user_id", user.id)
        .order("session_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as SessionWithPsychologist[];
    },
    enabled: !!user?.id,
  });

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "chat": return <MessageCircle className="h-4 w-4" />;
      case "audio": return <Phone className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isSessionToday = (sessionDate: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return sessionDate === today;
  };

  const canJoinSession = (session: SessionWithPsychologist) => {
    const sessionDateTime = new Date(`${session.session_date}T${session.start_time}`);
    const now = new Date();
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60 * 1000);
    
    return session.status === 'confirmed' && 
           now >= fifteenMinutesBefore && 
           now <= sessionDateTime &&
           session.session_url;
  };

  const upcomingSessions = sessions?.filter(session => 
    isFuture(new Date(`${session.session_date}T${session.start_time}`)) || 
    isSessionToday(session.session_date)
  );

  const pastSessions = sessions?.filter(session => 
    isPast(new Date(`${session.session_date}T${session.end_time}`)) &&
    !isSessionToday(session.session_date)
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg">Please sign in to view your sessions.</p>
            <Button onClick={() => navigate("/login")} className="mt-4">
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your sessions...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-chetna-primary mb-4">
            My Sessions
          </h1>
          <p className="text-lg text-gray-600">
            Manage your therapy sessions and appointments
          </p>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-chetna-primary" />
            Upcoming Sessions
          </h2>
          
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={session.psychologist.profile_image_url} 
                            alt={session.psychologist.name} 
                          />
                          <AvatarFallback className="bg-chetna-primary text-white">
                            {session.psychologist.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{session.psychologist.name}</CardTitle>
                          <CardDescription>{session.psychologist.specializations.join(', ')}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-chetna-primary" />
                      <span>{format(parseISO(session.session_date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-chetna-primary" />
                      <span>{session.start_time} - {session.end_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {getModeIcon(session.consultation_mode)}
                      <span className="capitalize">{session.consultation_mode}</span>
                    </div>
                    
                    <div className="text-sm">
                      <strong>Amount:</strong> ${session.total_amount}
                    </div>
                    
                    {session.notes && (
                      <div className="text-sm">
                        <strong>Notes:</strong> {session.notes}
                      </div>
                    )}
                    
                    {canJoinSession(session) && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(session.session_url, '_blank')}
                      >
                        Join Session
                      </Button>
                    )}
                    
                    {isSessionToday(session.session_date) && session.status === 'confirmed' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium">
                          📅 Session Today! Join 15 minutes before start time.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
                <Button onClick={() => navigate("/psychologists")}>
                  Book a Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Sessions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-chetna-primary" />
            Past Sessions
          </h2>
          
          {pastSessions && pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastSessions.map((session) => (
                <Card key={session.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={session.psychologist.profile_image_url} 
                            alt={session.psychologist.name} 
                          />
                          <AvatarFallback className="bg-chetna-primary text-white">
                            {session.psychologist.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{session.psychologist.name}</CardTitle>
                          <CardDescription>{session.psychologist.specializations.join(', ')}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-chetna-primary" />
                      <span>{format(parseISO(session.session_date), 'MMMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-chetna-primary" />
                      <span>{session.start_time} - {session.end_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {getModeIcon(session.consultation_mode)}
                      <span className="capitalize">{session.consultation_mode}</span>
                    </div>
                    
                    {session.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/sessions/${session.id}/review`)}
                        className="w-full"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No past sessions found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MySessions;
