
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Mail, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Appointment {
  id: string;
  user_id: string;
  therapist_id: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  status: string;
  notes?: string;
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  therapist?: {
    name: string;
    email?: string;
  };
}

interface EmailNotification {
  id: string;
  appointment_id: string;
  recipient_email: string;
  email_type: string;
  subject: string;
  status: string;
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is admin (simplified approach)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      // For now, check by email until database types are synced
      if (user.email === 'keshavkumarhf@gmail.com' || user.email === 'admin@example.com') {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch all appointments for admin
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          therapist:therapists(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: isAdmin
  });

  // Fetch email notifications using raw SQL
  const { data: emailNotifications = [] } = useQuery({
    queryKey: ['email-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_email_notifications');
      
      if (error) {
        console.log('Email notifications query failed:', error);
        return [] as EmailNotification[];
      }
      return data as EmailNotification[];
    },
    enabled: isAdmin
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, newStatus, notes }: { 
      appointmentId: string; 
      newStatus: string; 
      notes?: string; 
    }) => {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
        if (notes) updateData.cancellation_reason = notes;
      }

      if (notes && newStatus !== 'cancelled') {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast({
        title: "Status updated! ✅",
        description: "Appointment status has been updated successfully",
      });
      setSelectedAppointment('');
      setStatusNotes('');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  });

  // Send email notification mutation
  const sendEmailMutation = useMutation({
    mutationFn: async ({ appointmentId, emailType }: { 
      appointmentId: string; 
      emailType: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('send-appointment-email', {
        body: { appointmentId, emailType }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-notifications'] });
      toast({
        title: "Email sent! 📧",
        description: "Email notification has been sent successfully",
      });
    },
    onError: (error) => {
      console.error('Email send error:', error);
      toast({
        title: "Email failed",
        description: "Failed to send email notification",
        variant: "destructive",
      });
    }
  });

  const handleStatusUpdate = (newStatus: string) => {
    if (!selectedAppointment) return;
    
    updateStatusMutation.mutate({
      appointmentId: selectedAppointment,
      newStatus,
      notes: statusNotes
    });
  };

  const handleSendEmail = (appointmentId: string, emailType: string) => {
    sendEmailMutation.mutate({ appointmentId, emailType });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'cancelled': return 'destructive';
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-muted-foreground">You don't have admin privileges to access this dashboard.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Current user: {user.email}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Helmet>
        <title>Admin Dashboard - Chetna_AI</title>
        <meta name="description" content="Admin dashboard for managing appointments and system" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            <Shield className="h-8 w-8 inline mr-2" />
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage appointments, therapists, and system notifications
          </p>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
            <TabsTrigger value="emails">Email Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">
                        {appointments.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-2xl font-bold">
                        {appointments.filter(a => a.status === 'confirmed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="text-2xl font-bold">
                        {appointments.filter(a => a.status === 'cancelled').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{appointments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Manage and track all system appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(appointment.status)}
                              <Badge variant={getStatusBadgeVariant(appointment.status)}>
                                {appointment.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                #{appointment.id.slice(0, 8)}
                              </span>
                            </div>
                            <h4 className="font-semibold">
                              {appointment.therapist?.name || 'Unknown Therapist'}
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>📅 {appointment.appointment_date} at {appointment.appointment_time}</p>
                              <p>🎯 {appointment.session_type.replace('_', ' ').toUpperCase()}</p>
                              <p>👤 User ID: {appointment.user_id.slice(0, 8)}...</p>
                              {appointment.notes && <p>📝 Notes: {appointment.notes}</p>}
                              {appointment.cancellation_reason && (
                                <p>❌ Cancellation: {appointment.cancellation_reason}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Select
                              value={selectedAppointment === appointment.id ? 'selected' : ''}
                              onValueChange={(value) => {
                                if (value === 'selected') {
                                  setSelectedAppointment(appointment.id);
                                }
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Actions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="selected">Manage</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendEmail(appointment.id, 'status_update')}
                                disabled={sendEmailMutation.isPending}
                              >
                                📧
                              </Button>
                            </div>
                          </div>
                        </div>

                        {selectedAppointment === appointment.id && (
                          <div className="border-t pt-3 space-y-3">
                            <Textarea
                              placeholder="Add notes (optional)"
                              value={statusNotes}
                              onChange={(e) => setStatusNotes(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate('confirmed')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'confirmed'}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                ✅ Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate('cancelled')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'cancelled'}
                              >
                                ❌ Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleStatusUpdate('completed')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'completed'}
                              >
                                ✅ Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAppointment('');
                                  setStatusNotes('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="therapists" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Therapist Management</CardTitle>
                <CardDescription>Coming soon - manage therapist accounts and profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Therapist management features will be available soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Track all system email notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {emailNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No email notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emailNotifications.map((email) => (
                      <div key={email.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{email.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              To: {email.recipient_email}
                            </p>
                          </div>
                          <Badge variant={email.status === 'sent' ? 'default' : 'destructive'}>
                            {email.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {email.email_type}</p>
                          <p>Created: {new Date(email.created_at).toLocaleString()}</p>
                          {email.sent_at && (
                            <p>Sent: {new Date(email.sent_at).toLocaleString()}</p>
                          )}
                          {email.error_message && (
                            <p className="text-red-500">Error: {email.error_message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
