import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTherapistAuth } from '@/context/TherapistAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Star, 
  User, 
  Clock, 
  MessageCircle, 
  Edit, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import TherapistProfileEdit from '@/components/TherapistProfileEdit';
import Header from '@/components/Header';

const TherapistDashboard: React.FC = () => {
  const { therapist, isLoading } = useTherapistAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [editingProfile, setEditingProfile] = useState(false);
  const queryClient = useQueryClient();

  // Fetch therapist appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['therapist-appointments', therapist?.id],
    queryFn: async () => {
      if (!therapist?.id) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          user_id
        `)
        .eq('therapist_id', therapist.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!therapist?.id
  });

  // Fetch therapist reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['therapist-reviews', therapist?.id],
    queryFn: async () => {
      if (!therapist?.id) return [];
      
      const { data, error } = await supabase
        .from('session_reviews')
        .select('*')
        .eq('therapist_id', therapist.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!therapist?.id
  });

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;
      
      // Refresh appointments data
      queryClient.invalidateQueries({ queryKey: ['therapist-appointments', therapist?.id] });
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading therapist dashboard...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Therapist Access Required</h2>
              <p className="text-muted-foreground">
                You need to be a registered therapist to access this dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl" role="main">
        {/* Header with better spacing */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold" id="dashboard-title">
                Welcome, {therapist.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your appointments, reviews, and profile settings
              </p>
            </div>
            <Button
              onClick={() => setEditingProfile(!editingProfile)}
              variant="outline"
              size="lg"
              className="gap-2 self-start md:self-center"
              aria-label={editingProfile ? "Close profile editor" : "Edit your profile"}
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
              {editingProfile ? "Close Editor" : "Edit Profile"}
            </Button>
          </div>
        </header>

        {editingProfile && (
          <section className="mb-10" aria-labelledby="edit-profile-heading">
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle id="edit-profile-heading" className="text-xl">Edit Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <TherapistProfileEdit 
                  therapist={therapist}
                  onClose={() => setEditingProfile(false)}
                />
              </CardContent>
            </Card>
          </section>
        )}

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-8"
          aria-labelledby="dashboard-title"
        >
          <TabsList className="grid w-full grid-cols-3 h-auto p-1" role="tablist">
            <TabsTrigger 
              value="appointments" 
              className="gap-2 py-3"
              role="tab"
              aria-controls="appointments-panel"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Appointments</span>
              <span className="sm:hidden">Appts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="gap-2 py-3"
              role="tab"
              aria-controls="reviews-panel"
            >
              <Star className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reviews</span>
              <span className="sm:hidden">Reviews</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="gap-2 py-3"
              role="tab"
              aria-controls="stats-panel"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="appointments" 
            className="space-y-6 focus:outline-none"
            id="appointments-panel"
            role="tabpanel"
            aria-labelledby="appointments-tab"
          >
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl flex items-center gap-2" id="appointments-heading">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  Your Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {appointmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2">Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No appointments scheduled</p>
                  </div>
                ) : (
                  <ul className="space-y-5" role="list" aria-label="Your appointments">
                    {appointments.map((appointment) => (
                      <li 
                        key={appointment.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 border rounded-lg gap-4 hover:bg-accent/50 transition-all"
                        role="article"
                        aria-label={`Appointment on ${format(new Date(appointment.appointment_date), 'PPP')} at ${appointment.appointment_time}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">
                                {format(new Date(appointment.appointment_date), 'PPP')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 inline mr-1" />
                                {appointment.appointment_time}
                              </p>
                            </div>
                            <Badge variant={
                              appointment.status === 'confirmed' ? 'default' :
                              appointment.status === 'pending' ? 'secondary' :
                              appointment.status === 'cancelled' ? 'destructive' : 'default'
                            }>
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Session: {appointment.session_type}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Notes: {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'PP')}
                          </span>
                        </div>
                        {review.review_text && (
                          <p className="text-sm">{review.review_text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent 
            value="stats" 
            className="space-y-6 focus:outline-none"
            id="stats-panel"
            role="tabpanel"
            aria-labelledby="stats-tab"
          >
            <section aria-labelledby="statistics-heading">
              <h2 id="statistics-heading" className="text-xl font-semibold mb-6">Your Performance Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                    <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" aria-label={`${appointments.length} total appointments`}>
                      {appointments.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">All time bookings</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" aria-label={`${therapist.rating.toFixed(1)} out of 5 stars average rating`}>
                      {therapist.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Out of 5 stars</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    <MessageCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" aria-label={`${therapist.total_reviews} total reviews received`}>
                      {therapist.total_reviews}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Patient feedback</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TherapistDashboard;
