
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, MessageSquare, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const MyTherapySessions: React.FC = () => {
  const { user } = useAuth();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['my-therapy-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          psychologist:psychologist_id (
            name,
            specialization,
            rating
          )
        `)
        .eq('client_id', user.id)
        .order('session_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingSessions = sessions?.filter(session => 
    new Date(session.session_date) >= new Date() && session.status === 'scheduled'
  ) || [];

  const pastSessions = sessions?.filter(session => 
    new Date(session.session_date) < new Date() || session.status === 'completed'
  ) || [];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Please Log In</CardTitle>
              <CardDescription>
                You need to be logged in to view your therapy sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full">Log In</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">Loading your sessions...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
      <Helmet>
        <title>My Therapy Sessions - Chetna_AI</title>
        <meta name="description" content="View and manage your therapy sessions" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Therapy Sessions</h1>
              <p className="text-muted-foreground">Manage your appointments and session history</p>
            </div>
            <Link to="/therapy">
              <Button>Book New Session</Button>
            </Link>
          </div>

          {sessions?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No sessions booked yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your mental health journey by booking your first session with a licensed therapist.
                </p>
                <Link to="/therapy">
                  <Button>Book Your First Session</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingSessions.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Sessions ({pastSessions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingSessions.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No upcoming sessions</p>
                        <Link to="/therapy">
                          <Button className="mt-4">Book a Session</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const SessionCard: React.FC<{ session: any }> = ({ session }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold">Session with {session.psychologist?.name}</h3>
              <Badge className={`${getStatusColor(session.status)} border-0`}>
                {session.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(session.session_date), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.start_time} - {session.end_time}
              </div>
              <div className="flex items-center gap-1">
                {session.session_type === 'video_call' ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                {session.session_type === 'video_call' ? 'Video Call' : 'Text Chat'}
              </div>
            </div>
            
            {session.psychologist?.specialization && (
              <div className="flex gap-1 mb-3">
                {session.psychologist.specialization.slice(0, 3).map((spec: string) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}
            
            {session.client_notes && (
              <p className="text-sm text-muted-foreground">
                <strong>Your Notes:</strong> {session.client_notes}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {session.status === 'scheduled' && session.session_type === 'video_call' && session.meeting_link && (
              <Button asChild>
                <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-1" />
                  Join Call
                </a>
              </Button>
            )}
            
            {session.status === 'completed' && (
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-1" />
                Rate Session
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTherapySessions;
