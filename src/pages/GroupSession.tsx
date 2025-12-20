import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGroupSession } from '@/hooks/useGroupSession';
import SessionHeader from '@/components/group-therapy/SessionHeader';
import MessageList from '@/components/group-therapy/MessageList';
import ChatInput from '@/components/group-therapy/ChatInput';
import ParticipantsSidebar from '@/components/group-therapy/ParticipantsSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const GroupSession = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Fetch room details
  const { data: room, isLoading: roomLoading, error: roomError } = useQuery({
    queryKey: ['group-therapy-room', roomId],
    queryFn: async () => {
      if (!roomId) return null;
      
      const { data, error } = await supabase
        .from('group_therapy_rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (error) {
        console.error('Error fetching room:', error);
        throw error;
      }
      return data;
    },
    enabled: !!roomId,
  });

  // Check if user is a participant
  const { data: isParticipant, isLoading: participantLoading } = useQuery({
    queryKey: ['is-participant', roomId, currentUser?.id],
    queryFn: async () => {
      if (!roomId || !currentUser?.id) return false;
      
      const { data, error } = await supabase
        .from('group_therapy_participants')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', currentUser.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking participant:', error);
        return false;
      }
      return !!data;
    },
    enabled: !!roomId && !!currentUser?.id,
  });

  // Use the group session hook for real-time messaging
  const {
    messages,
    participants,
    isConnected,
    typingUsers,
    displayName,
    sendMessage,
    updateTypingStatus
  } = useGroupSession({
    roomId: roomId || '',
    userId: currentUser?.id || null
  });

  const handleRaiseHand = () => {
    setIsHandRaised(prev => !prev);
  };

  // Loading state
  if (roomLoading || participantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to join group therapy sessions.
          </p>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Room not found
  if (roomError || !room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Room Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This therapy room doesn't exist or is no longer active.
          </p>
          <Link to="/group-therapy">
            <Button>Browse Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not a participant
  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Join the Room First</h2>
          <p className="text-muted-foreground mb-4">
            You need to join "{room.room_name}" before you can access the session.
          </p>
          <Link to="/group-therapy">
            <Button>Go to Group Therapy</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <SessionHeader
        roomName={room.room_name}
        therapyType={room.therapy_type}
        participantCount={participants.length + 1}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <main className="flex-1 flex flex-col">
          <MessageList
            messages={messages}
            currentUserId={currentUser?.id}
            typingUsers={typingUsers}
          />
          
          <ChatInput
            onSendMessage={sendMessage}
            onTypingChange={updateTypingStatus}
            disabled={!isConnected}
          />
        </main>

        {/* Participants Sidebar (hidden on mobile) */}
        <ParticipantsSidebar
          participants={participants}
          currentUserId={currentUser?.id}
          displayName={displayName}
          onRaiseHand={handleRaiseHand}
          isHandRaised={isHandRaised}
        />
      </div>
    </div>
  );
};

export default GroupSession;
