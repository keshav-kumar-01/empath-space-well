
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Video, Clock, UserPlus, UserMinus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const GroupTherapy = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms } = useQuery({
    queryKey: ['group-therapy-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_therapy_rooms')
        .select(`
          *,
          group_therapy_participants (
            id,
            user_id,
            is_active
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: myParticipations } = useQuery({
    queryKey: ['my-group-participations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_therapy_participants')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const room = rooms?.find(r => r.id === roomId);
      if (!room) throw new Error('Room not found');
      
      if (room.current_participants >= room.max_participants) {
        throw new Error('Room is full');
      }

      const { data, error } = await supabase
        .from('group_therapy_participants')
        .insert({
          room_id: roomId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update room participant count
      await supabase
        .from('group_therapy_rooms')
        .update({ current_participants: room.current_participants + 1 })
        .eq('id', roomId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-therapy-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-group-participations'] });
      toast.success('Successfully joined the therapy room! 👥');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to join room');
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase
        .from('group_therapy_participants')
        .update({ is_active: false })
        .eq('room_id', roomId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Update room participant count
      const room = rooms?.find(r => r.id === roomId);
      if (room) {
        await supabase
          .from('group_therapy_rooms')
          .update({ current_participants: Math.max(0, room.current_participants - 1) })
          .eq('id', roomId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-therapy-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-group-participations'] });
      toast.success('Left the therapy room');
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

  const formatSchedule = (schedule: string | null) => {
    if (!schedule) return 'Schedule TBD';
    try {
      const parsed = JSON.parse(schedule);
      return `${parsed.day} at ${parsed.time}`;
    } catch {
      return schedule;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Group Therapy Rooms</h1>
        <p className="text-gray-600">Join supportive group sessions for healing and growth</p>
      </div>

      <div className="grid gap-6">
        {rooms?.map((room) => (
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
                    {room.current_participants}/{room.max_participants} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatSchedule(room.meeting_schedule)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isUserInRoom(room.id) ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Session
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => leaveRoomMutation.mutate(room.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => joinRoomMutation.mutate(room.id)}
                      disabled={room.current_participants >= room.max_participants}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {room.current_participants >= room.max_participants ? 'Room Full' : 'Join Room'}
                    </Button>
                  )}
                </div>
              </div>

              {room.group_therapy_participants && room.group_therapy_participants.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Active Members</p>
                  <div className="flex -space-x-2">
                    {room.group_therapy_participants
                      .filter((p: any) => p.is_active)
                      .slice(0, 5)
                      .map((participant: any, index: number) => (
                        <Avatar key={participant.id} className="border-2 border-white w-8 h-8">
                          <AvatarFallback className="text-xs">
                            U{index + 1}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {room.group_therapy_participants.filter((p: any) => p.is_active).length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{room.group_therapy_participants.filter((p: any) => p.is_active).length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isUserInRoom(room.id) && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    🌸 You're a member of this group! The next session will start soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active therapy rooms</h3>
          <p className="text-gray-600">New group therapy sessions will be available soon!</p>
        </div>
      )}
    </div>
  );
};

export default GroupTherapy;
