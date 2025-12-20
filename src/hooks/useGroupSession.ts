import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAnonymousName } from '@/utils/anonymousNames';
import { toast } from 'sonner';

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  message_type: 'user' | 'ai' | 'system';
  display_name: string;
  created_at: string;
}

interface Participant {
  user_id: string;
  display_name: string;
  is_typing: boolean;
  joined_at: string;
}

interface UseGroupSessionProps {
  roomId: string;
  userId: string | null;
}

export const useGroupSession = ({ roomId, userId }: UseGroupSessionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const channelRef = useRef<any>(null);
  const presenceChannelRef = useRef<any>(null);

  // Generate display name when user and room are available
  useEffect(() => {
    if (userId && roomId) {
      const name = getAnonymousName(userId, roomId);
      setDisplayName(name);
    }
  }, [userId, roomId]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId || !userId) return;

      // Using type assertion since the table was just created
      const { data, error } = await (supabase
        .from('group_therapy_messages' as any)
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100) as any);

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages((data as Message[]) || []);
    };

    fetchMessages();
  }, [roomId, userId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId || !userId || !displayName) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`room-messages-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_therapy_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    channelRef.current = messagesChannel;

    // Set up presence channel for typing indicators and online status
    const presenceChannel = supabase.channel(`room-presence-${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const onlineParticipants: Participant[] = [];
        const typing: string[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            onlineParticipants.push({
              user_id: presence.user_id,
              display_name: presence.display_name,
              is_typing: presence.is_typing,
              joined_at: presence.joined_at
            });

            if (presence.is_typing && presence.user_id !== userId) {
              typing.push(presence.display_name);
            }
          });
        });

        setParticipants(onlineParticipants);
        setTypingUsers(typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            display_name: displayName,
            is_typing: false,
            joined_at: new Date().toISOString()
          });
        }
      });

    presenceChannelRef.current = presenceChannel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
      }
    };
  }, [roomId, userId, displayName]);

  // Send message
  const sendMessage = useCallback(async (messageText: string) => {
    if (!roomId || !userId || !displayName || !messageText.trim()) {
      return false;
    }

    // Using type assertion since the table was just created
    const { error } = await (supabase
      .from('group_therapy_messages' as any)
      .insert({
        room_id: roomId,
        user_id: userId,
        message: messageText.trim(),
        message_type: 'user',
        display_name: displayName
      }) as any);

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }

    return true;
  }, [roomId, userId, displayName]);

  // Update typing status
  const updateTypingStatus = useCallback(async (typing: boolean) => {
    if (!presenceChannelRef.current || !userId || !displayName) return;

    setIsTyping(typing);
    
    await presenceChannelRef.current.track({
      user_id: userId,
      display_name: displayName,
      is_typing: typing,
      joined_at: new Date().toISOString()
    });
  }, [userId, displayName]);

  // Send system message (for join/leave events)
  const sendSystemMessage = useCallback(async (text: string) => {
    if (!roomId) return;

    // System messages are inserted without user_id check in RLS
    // This would need to be done via an edge function or admin
    console.log('System message:', text);
  }, [roomId]);

  return {
    messages,
    participants,
    isConnected,
    isTyping,
    typingUsers,
    displayName,
    sendMessage,
    updateTypingStatus,
    sendSystemMessage
  };
};
