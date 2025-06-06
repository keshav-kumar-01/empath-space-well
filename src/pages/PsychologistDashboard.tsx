
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, MessageSquare, User, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PsychologistDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: psychologistProfile } = useQuery({
    queryKey: ['psychologist-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: sessions } = useQuery({
    queryKey: ['psychologist-sessions', psychologistProfile?.id],
    queryFn: async () => {
      if (!psychologistProfile?.id) return [];
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          client:client_id (
            email
          )
        `)
        .eq('psychologist_id', psychologistProfile.id)
        .order('session_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!psychologistProfile?.id
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, status }: { sessionId: string; status: string }) => {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({ status })
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychologist-sessions'] });
      toast({
        title: "Session updated",
        description: "Session status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update session status.",
        variant: "destructive",
      });
    }
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

  if (!psychologistProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have access to the psychologist dashboard. Please contact an administrator if you believe this is an error.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const todaySessions = sessions?.filter(session => 
    format(new Date(session.session_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ) || [];

  const upcomingSessions = sessions?.filter(session => 
    new Date(session.session_date) > new Date() && session.status === 'scheduled'
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
      <Helmet>
        <title>Psychologist Dashboard - Chetna_AI</title>
        <meta name="description" content="Manage your therapy sessions and client appointments" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {psychologistProfile.name}</h1>
            <p className="text-muted-foreground">Manage your therapy sessions and client appointments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chetna-primary">{todaySessions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chetna-secondary">{upcomingSessions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {psychologistProfile.rating || '0.0'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {psychologistProfile.total_reviews || 0} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="today" className="space-y-6">
            <TabsList>
              <TabsTrigger value="today">Today's Sessions</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="all">All Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today">
              <div className="space-y-4">
                {todaySessions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">No sessions scheduled for today</p>
                    </CardContent>
                  </Card>
                ) : (
                  todaySessions.map((session) => (
                    <SessionCard 
                      key={session.id} 
                      session={session} 
                      onUpdateStatus={updateSessionMutation.mutate}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">No upcoming sessions</p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingSessions.map((session) => (
                    <SessionCard 
                      key={session.id} 
                      session={session} 
                      onUpdateStatus={updateSessionMutation.mutate}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {sessions?.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onUpdateStatus={updateSessionMutation.mutate}
                  />
                )) || []}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const SessionCard: React.FC<{ 
  session: any; 
  onUpdateStatus: (params: { sessionId: string; status: string }) => void 
}> = ({ session, onUpdateStatus }) => {
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
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{session.client?.email || 'Unknown Client'}</span>
              </div>
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
            
            {session.client_notes && (
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Client Notes:</strong> {session.client_notes}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {session.status === 'scheduled' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus({ sessionId: session.id, status: 'ongoing' })}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus({ sessionId: session.id, status: 'cancelled' })}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            
            {session.status === 'ongoing' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus({ sessionId: session.id, status: 'completed' })}
              >
                Complete Session
              </Button>
            )}
            
            {session.session_type === 'video_call' && session.meeting_link && (
              <Button size="sm" variant="outline" asChild>
                <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-1" />
                  Join Call
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PsychologistDashboard;
