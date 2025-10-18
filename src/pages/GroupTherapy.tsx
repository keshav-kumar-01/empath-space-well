
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Video, UserPlus, UserMinus, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GroupTherapy = () => {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['group-therapy-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_therapy_rooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }
      return data;
    },
  });

  const { data: myParticipations } = useQuery({
    queryKey: ['my-group-participations'],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('group_therapy_participants')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching participations:', error);
        return [];
      }
      return data;
    },
    enabled: !!currentUser?.id,
  });

  const { data: allParticipants } = useQuery({
    queryKey: ['all-participants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_therapy_participants')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching all participants:', error);
        return [];
      }
      return data;
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      if (!currentUser?.id) {
        throw new Error('Please log in to join a therapy room');
      }
      
      const room = rooms?.find(r => r.id === roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      
      const currentParticipants = allParticipants?.filter(p => p.room_id === roomId && p.is_active).length || 0;
      if (currentParticipants >= (room.max_participants || 8)) {
        throw new Error('Room is full');
      }

      const { data, error } = await supabase
        .from('group_therapy_participants')
        .insert({
          room_id: roomId,
          user_id: currentUser.id,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error joining room:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-therapy-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-group-participations'] });
      queryClient.invalidateQueries({ queryKey: ['all-participants'] });
      toast.success('Successfully joined the therapy room! 👥');
    },
    onError: (error: any) => {
      console.error('Join room error:', error);
      toast.error(error.message || 'Failed to join room');
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('group_therapy_participants')
        .update({ is_active: false })
        .eq('room_id', roomId)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error leaving room:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-therapy-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-group-participations'] });
      queryClient.invalidateQueries({ queryKey: ['all-participants'] });
      toast.success('Left the therapy room');
    },
    onError: (error: any) => {
      console.error('Leave room error:', error);
      toast.error(error.message || 'Failed to leave room');
    },
  });

  const getTherapyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      anxiety: 'bg-blue-100 text-blue-800',
      depression: 'bg-purple-100 text-purple-800',
      grief: 'bg-gray-100 text-gray-800',
      addiction: 'bg-red-100 text-red-800',
      general: 'bg-green-100 text-green-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTherapyTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      anxiety: '🧘',
      depression: '💙',
      grief: '🕊️',
      addiction: '💪',
      general: '🌸',
    };
    return emojis[type] || '👥';
  };

  const isUserInRoom = (roomId: string) => {
    return myParticipations?.some(p => p.room_id === roomId && p.is_active);
  };

  const getRoomParticipantCount = (roomId: string) => {
    return allParticipants?.filter(p => p.room_id === roomId && p.is_active).length || 0;
  };

  const formatSchedule = (schedule: string | null) => {
    if (!schedule) return 'Schedule TBD';
    try {
      const parsed = JSON.parse(schedule);
      return `${parsed.day} at ${parsed.time}`;
    } catch {
      return schedule;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading group therapy rooms...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load group therapy rooms</h3>
              <p className="text-gray-600 mb-4">There was an error loading the therapy rooms. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in to join group therapy</h3>
              <p className="text-gray-600 mb-4">You need to be logged in to view and join group therapy sessions.</p>
              <Link to="/login">
                <Button>Log In</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        <div className="mb-8">
          <Link to="/ai-features">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Features
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Group Therapy Rooms</h1>
            <p className="text-gray-600">Join supportive group sessions for healing and growth</p>
          </div>
        </div>

        <div className="grid gap-6">
          {rooms?.map((room) => {
            const participantCount = getRoomParticipantCount(room.id);
            const maxParticipants = room.max_participants || 8;
            const isRoomFull = participantCount >= maxParticipants;
            const userInRoom = isUserInRoom(room.id);

            return (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTherapyTypeEmoji(room.therapy_type)}</span>
                      <div>
                        <CardTitle className="text-lg">{room.room_name}</CardTitle>
                        <p className="text-gray-600 text-sm mt-1">{room.description}</p>
                      </div>
                    </div>
                    <Badge className={getTherapyTypeColor(room.therapy_type)}>
                      {room.therapy_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {participantCount}/{maxParticipants} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatSchedule(room.meeting_schedule)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {userInRoom ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                            onClick={() => toast.success('Session will start soon! 🎥')}
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Join Session
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => leaveRoomMutation.mutate(room.id)}
                            disabled={leaveRoomMutation.isPending}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => joinRoomMutation.mutate(room.id)}
                          disabled={isRoomFull || joinRoomMutation.isPending}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {isRoomFull ? 'Room Full' : 'Join Room'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {participantCount > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Active Members</p>
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(participantCount, 5) }).map((_, index) => (
                          <Avatar key={index} className="border-2 border-white w-8 h-8">
                            <AvatarFallback className="text-xs">
                              U{index + 1}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {participantCount > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                            +{participantCount - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {userInRoom && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        🌸 You're a member of this group! The next session will start soon.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {rooms?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active therapy rooms</h3>
            <p className="text-gray-600">New group therapy sessions will be available soon!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupTherapy;
