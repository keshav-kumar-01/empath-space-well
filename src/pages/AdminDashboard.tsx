import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Shield, CheckCircle, XCircle, AlertCircle, Plus, RefreshCw, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import AddTherapistForm from '@/components/AddTherapistForm';
import EditTherapistForm from '@/components/EditTherapistForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { checkIsAdmin } from '@/utils/adminSetup';

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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);
  const [showAddTherapistDialog, setShowAddTherapistDialog] = useState<boolean>(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }
      
      try {
        const { isAdmin: adminStatus } = await checkIsAdmin(user.id, user.email);
        setIsAdmin(adminStatus);
        console.log('Admin status:', adminStatus, 'for user:', user.email);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch all appointments with admin bypass for RLS
  const { data: appointments = [], isLoading: appointmentsLoading, error: appointmentsError, refetch: refetchAppointments } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      console.log('🔍 Fetching appointments for admin dashboard...');
      
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        // Verify admin status first
        const { isAdmin: userIsAdmin } = await checkIsAdmin(user.id, user.email);
        if (!userIsAdmin) {
          console.log('❌ User is not admin, cannot fetch all appointments');
          return [];
        }

        console.log('✅ User confirmed as admin, fetching all appointments...');

        // Use service role or admin bypass to get ALL appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .rpc('get_all_appointments_admin')
          .select();
        
        // If the RPC doesn't exist, fall back to direct query with potential RLS bypass
        if (appointmentsError && appointmentsError.message?.includes('function')) {
          console.log('📋 RPC not found, using direct query...');
          
          // Direct query - this should work if admin has proper permissions
          const { data: directData, error: directError } = await supabase
            .from('appointments')
            .select(`
              *,
              therapist:therapists!inner(id, name)
            `)
            .order('created_at', { ascending: false });
          
          if (directError) {
            console.error('❌ Direct query error:', directError);
            // Try without the join to see if that's the issue
            const { data: simpleData, error: simpleError } = await supabase
              .from('appointments')
              .select('*')
              .order('created_at', { ascending: false });
              
            if (simpleError) {
              console.error('❌ Simple query error:', simpleError);
              throw new Error(`Failed to fetch appointments: ${simpleError.message}`);
            }
            
            console.log('✅ Simple query successful, appointments found:', simpleData?.length || 0);
            return simpleData || [];
          }
          
          console.log('✅ Direct query successful, appointments found:', directData?.length || 0);
          return directData || [];
        }
        
        if (appointmentsError) {
          console.error('❌ RPC error:', appointmentsError);
          throw new Error(`Failed to fetch appointments: ${appointmentsError.message}`);
        }
        
        console.log('✅ RPC successful, appointments found:', appointmentsData?.length || 0);
        return appointmentsData || [];
        
      } catch (error: any) {
        console.error('💥 Exception in appointment fetch:', error);
        throw error;
      }
    },
    enabled: isAdmin && !isCheckingAdmin && !!user?.id,
    retry: 3,
    retryDelay: 1000,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch therapists
  const { data: therapists = [], isLoading: therapistsLoading } = useQuery({
    queryKey: ['admin-therapists'],
    queryFn: async () => {
      console.log('🔍 Fetching therapists for admin...');
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Therapist fetch error:', error);
        throw error;
      }
      
      console.log('✅ Therapists fetched:', data?.length || 0);
      return data || [];
    },
    enabled: isAdmin && !isCheckingAdmin
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, newStatus, notes }: { 
      appointmentId: string; 
      newStatus: string; 
      notes?: string; 
    }) => {
      console.log('🔄 Updating appointment status:', { appointmentId, newStatus, notes });
      
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
        if (notes?.trim()) {
          updateData.cancellation_reason = notes.trim();
        }
      }

      if (notes?.trim() && newStatus !== 'cancelled') {
        updateData.notes = notes.trim();
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      
      console.log('✅ Appointment updated:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast({
        title: "✅ Status Updated",
        description: `Appointment ${data.status}`,
      });
      setSelectedAppointment('');
      setStatusNotes('');
    },
    onError: (error: any) => {
      console.error('❌ Mutation error:', error);
      toast({
        title: "❌ Update Failed",
        description: error.message || 'Failed to update appointment',
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
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">🔒 Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chetna-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">🔍 Checking Admin Access...</h1>
            <p className="text-muted-foreground">Please wait while we verify your permissions.</p>
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
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">🚫 Access Denied</h1>
            <p className="text-muted-foreground">You don't have admin privileges.</p>
            <p className="text-sm text-muted-foreground mt-2">
              User: {user.email} (ID: {user.id?.slice(0, 8)}...)
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-7xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-2 md:mb-4">
            <Shield className="h-6 w-6 md:h-8 md:w-8 inline mr-2" />
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Manage appointments and therapists
          </p>
          <div className="mt-2 text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>👤 {user.email}</span>
            <span>•</span>
            <span>📅 {appointments.length} appointments</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchAppointments()}
              disabled={appointmentsLoading}
              className="ml-2 h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${appointmentsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {appointmentsError && (
          <div className="mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-semibold text-sm md:text-base">⚠️ Error loading appointments:</p>
            <p className="text-red-600 text-sm">{appointmentsError.message}</p>
            <Button 
              onClick={() => refetchAppointments()} 
              className="mt-2 text-xs"
              variant="outline"
            >
              🔄 Retry
            </Button>
          </div>
        )}

        <Tabs defaultValue="appointments" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="appointments" className="text-xs md:text-sm p-2 md:p-3">
              📅 Appointments ({appointments.length})
            </TabsTrigger>
            <TabsTrigger value="therapists" className="text-xs md:text-sm p-2 md:p-3">
              👨‍⚕️ Therapists ({therapists.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
              <Card className="p-2 md:p-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <AlertCircle className="h-3 w-3 md:h-5 md:w-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {appointments.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <CheckCircle className="h-3 w-3 md:h-5 md:w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {appointments.filter(a => a.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <XCircle className="h-3 w-3 md:h-5 md:w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {appointments.filter(a => a.status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <Calendar className="h-3 w-3 md:h-5 md:w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg md:text-2xl font-bold">{appointments.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Appointments List */}
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-lg md:text-xl">📋 All Appointments</CardTitle>
                <CardDescription className="text-sm">
                  Manage and track all appointments
                  {appointmentsLoading && <span className="text-blue-600 ml-2">(🔄 Loading...)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 md:p-6">
                {appointmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chetna-primary mx-auto mb-4"></div>
                    <p>Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-semibold">📭 No appointments found</p>
                    <p className="text-sm">Appointments will appear here once users start booking</p>
                    {appointmentsError && (
                      <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm">There might be a permission issue. Please check the console for details.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 md:p-4 border rounded-lg space-y-2 md:space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {getStatusIcon(appointment.status)}
                              <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs">
                                {appointment.status.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">
                                #{appointment.id.slice(0, 8)}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm md:text-lg">
                              🩺 {appointment.therapist?.name || 'Therapist ID: ' + appointment.therapist_id}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mt-2">
                              <p>📅 {appointment.appointment_date}</p>
                              <p>🕒 {appointment.appointment_time}</p>
                              <p>🎯 {appointment.session_type.replace('_', ' ').toUpperCase()}</p>
                              <p>👤 User: {appointment.user_id.slice(0, 8)}...</p>
                            </div>
                            {appointment.notes && (
                              <p className="text-xs md:text-sm mt-2 p-2 bg-blue-50 rounded text-blue-800">
                                📝 {appointment.notes}
                              </p>
                            )}
                            {appointment.cancellation_reason && (
                              <p className="text-xs md:text-sm mt-2 p-2 bg-red-50 rounded text-red-800">
                                ❌ {appointment.cancellation_reason}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              📅 Created: {new Date(appointment.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (selectedAppointment === appointment.id) {
                                  setSelectedAppointment('');
                                  setStatusNotes('');
                                } else {
                                  setSelectedAppointment(appointment.id);
                                  setStatusNotes('');
                                }
                              }}
                              className="flex-1 md:flex-none text-xs md:text-sm h-8 md:h-9"
                            >
                              {selectedAppointment === appointment.id ? '❌ Cancel' : '⚙️ Manage'}
                            </Button>
                          </div>
                        </div>

                        {selectedAppointment === appointment.id && (
                          <div className="border-t pt-3 md:pt-4 space-y-2 md:space-y-3 bg-muted/30 p-3 md:p-4 rounded-lg">
                            <Textarea
                              placeholder="Add notes or cancellation reason (optional)"
                              value={statusNotes}
                              onChange={(e) => setStatusNotes(e.target.value)}
                              className="min-h-[60px] md:min-h-[80px] text-sm"
                            />
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate('confirmed')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'confirmed'}
                                className="bg-green-600 hover:bg-green-700 text-xs md:text-sm h-8 md:h-9"
                              >
                                ✅ Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate('cancelled')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'cancelled'}
                                className="text-xs md:text-sm h-8 md:h-9"
                              >
                                ❌ Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleStatusUpdate('completed')}
                                disabled={updateStatusMutation.isPending || appointment.status === 'completed'}
                                className="text-xs md:text-sm h-8 md:h-9"
                              >
                                ✅ Complete
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

          <TabsContent value="therapists" className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">👨‍⚕️ Therapist Management</h2>
                <p className="text-muted-foreground text-sm md:text-base">Manage therapist profiles and availability</p>
              </div>
              <Dialog open={showAddTherapistDialog} onOpenChange={setShowAddTherapistDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Therapist
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto m-2">
                  <DialogHeader>
                    <DialogTitle>Add New Therapist</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new therapist
                    </DialogDescription>
                  </DialogHeader>
                  <AddTherapistForm 
                    onSuccess={() => setShowAddTherapistDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Edit Therapist Dialog */}
            <Dialog open={!!editingTherapist} onOpenChange={() => setEditingTherapist(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto m-2">
                <DialogHeader>
                  <DialogTitle>Edit Therapist</DialogTitle>
                  <DialogDescription>
                    Update therapist information and availability
                  </DialogDescription>
                </DialogHeader>
                {editingTherapist && (
                  <EditTherapistForm
                    therapist={editingTherapist}
                    onCancel={() => setEditingTherapist(null)}
                    onSuccess={() => setEditingTherapist(null)}
                  />
                )}
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-lg md:text-xl">All Therapists</CardTitle>
                <CardDescription className="text-sm">
                  {therapists.length} therapist{therapists.length !== 1 ? 's' : ''} in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 md:p-6">
                {therapistsLoading ? (
                  <div className="text-center py-8">Loading therapists...</div>
                ) : therapists.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No therapists found</p>
                    <p className="text-sm">Add your first therapist to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {therapists.map((therapist) => (
                      <Card key={therapist.id} className="p-3 md:p-4">
                        <div className="flex items-start gap-3 md:gap-4">
                          {therapist.avatar_url ? (
                            <img
                              src={therapist.avatar_url}
                              alt={therapist.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base truncate">{therapist.name}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">{therapist.experience}</p>
                            <p className="text-xs md:text-sm font-medium">{therapist.fee}</p>
                            
                            <div className="mt-2 flex items-center gap-1 md:gap-2 flex-wrap">
                              <Badge variant={therapist.available ? "default" : "secondary"} className="text-xs">
                                {therapist.available ? "Available" : "Unavailable"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                ⭐ {therapist.rating} ({therapist.total_reviews})
                              </span>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Specialties:</p>
                              <div className="flex flex-wrap gap-1">
                                {therapist.specialties?.slice(0, 2).map((specialty) => (
                                  <Badge key={specialty} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                                {therapist.specialties?.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{therapist.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTherapist(therapist)}
                                className="w-full text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
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
