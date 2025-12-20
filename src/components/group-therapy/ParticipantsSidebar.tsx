import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hand, Bot, Users } from 'lucide-react';
import { getAnonymousInitials, getAvatarColor } from '@/utils/anonymousNames';

interface Participant {
  user_id: string;
  display_name: string;
  is_typing: boolean;
  joined_at: string;
}

interface ParticipantsSidebarProps {
  participants: Participant[];
  currentUserId: string | null;
  displayName: string;
  onRaiseHand?: () => void;
  isHandRaised?: boolean;
}

const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({
  participants,
  currentUserId,
  displayName,
  onRaiseHand,
  isHandRaised = false
}) => {
  return (
    <aside className="w-64 border-l border-border bg-card p-4 hidden lg:flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Participants
        </h2>
        <Badge variant="secondary" className="text-xs">
          {participants.length + 1}
        </Badge>
      </div>

      {/* Raise Hand Button */}
      <Button
        variant={isHandRaised ? "default" : "outline"}
        className={`mb-4 w-full ${isHandRaised ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
        onClick={onRaiseHand}
      >
        <Hand className={`h-4 w-4 mr-2 ${isHandRaised ? 'animate-pulse' : ''}`} />
        {isHandRaised ? 'Hand Raised ✋' : 'Raise Hand'}
      </Button>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {/* AI Facilitator */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <Avatar className="h-8 w-8 ring-2 ring-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">
              Dr. Chetna 🤖
            </p>
            <p className="text-xs text-muted-foreground">AI Facilitator</p>
          </div>
        </div>

        {/* Current User (You) */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`${getAvatarColor(displayName)} text-white text-xs`}>
              {getAnonymousInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">You</p>
          </div>
          <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
        </div>

        {/* Other Participants */}
        {participants
          .filter(p => p.user_id !== currentUserId)
          .map((participant) => (
            <div
              key={participant.user_id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${getAvatarColor(participant.display_name)} text-white text-xs`}>
                  {getAnonymousInitials(participant.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {participant.display_name}
                </p>
                {participant.is_typing && (
                  <p className="text-xs text-primary animate-pulse">typing...</p>
                )}
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            </div>
          ))}
      </div>

      {/* Guidelines */}
      <div className="mt-4 pt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">Session Guidelines</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Be kind and supportive</li>
          <li>• Respect everyone's privacy</li>
          <li>• Share at your own pace</li>
          <li>• No judgment zone 💜</li>
        </ul>
      </div>
    </aside>
  );
};

export default ParticipantsSidebar;
