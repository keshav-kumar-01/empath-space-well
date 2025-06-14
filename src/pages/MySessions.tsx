
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Video, Clock, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  jitsi_room_id: string | null;
  meeting_link: string | null;
  notes: string | null;
  therapist: {
    name: string;
    photo_url: string | null;
  };
}

const MySessions: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          therapists (
            name,
            photo_url
          )
        `)
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const joinSession = (session: Session) => {
    if (session.meeting_link) {
      window.open(session.meeting_link, '_blank');
    } else if (session.jitsi_room_id) {
      window.open(`https://meet.jit.si/${session.jitsi_room_id}`, '_blank');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>Please sign in to view your therapy sessions.</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chetna-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
      <Helmet>
        <title>My Sessions | Chetna AI</title>
        <meta name="description" content="View and manage your therapy sessions." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            My Therapy Sessions
          </h1>
          <p className="text-gray-600">
            View your scheduled and completed therapy sessions.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sessions Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't booked any therapy sessions yet.
              </p>
              <Button
                onClick={() => window.location.href = '/therapy'}
                className="bg-gradient-to-r from-chetna-primary to-chetna-secondary"
              >
                Browse Therapists
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="feature-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-chetna-primary" />
                        <h3 className="text-lg font-semibold">
                          Session with {session.therapist?.name || 'Therapist'}
                        </h3>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(session.session_date), 'PPP')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration_minutes} minutes</span>
                        </div>
                      </div>

                      {session.notes && (
                        <p className="text-gray-600 text-sm mb-3">
                          <strong>Notes:</strong> {session.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4 md:mt-0">
                      {session.status === 'scheduled' && (session.meeting_link || session.jitsi_room_id) && (
                        <Button
                          onClick={() => joinSession(session)}
                          className="bg-gradient-to-r from-chetna-primary to-chetna-secondary"
                          size="sm"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      )}
                      
                      {session.meeting_link && (
                        <Button
                          onClick={() => window.open(session.meeting_link!, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Meeting Link
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MySessions;
