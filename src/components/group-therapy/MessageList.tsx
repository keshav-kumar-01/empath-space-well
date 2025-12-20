import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAnonymousInitials, getAvatarColor } from '@/utils/anonymousNames';
import { format } from 'date-fns';
import { Bot } from 'lucide-react';

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  message_type: 'user' | 'ai' | 'system';
  display_name: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | null;
  typingUsers: string[];
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Welcome to the session! 🌸</p>
          <p className="text-sm">Be the first to share how you're feeling today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        const isCurrentUser = msg.user_id === currentUserId;
        const isAI = msg.message_type === 'ai';
        const isSystem = msg.message_type === 'system';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {msg.message}
              </span>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <Avatar className={`h-8 w-8 flex-shrink-0 ${isAI ? 'ring-2 ring-primary' : ''}`}>
              {isAI ? (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              ) : (
                <AvatarFallback className={`${getAvatarColor(msg.display_name)} text-white text-xs`}>
                  {getAnonymousInitials(msg.display_name)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {/* Display Name */}
              <span className={`text-xs font-medium mb-1 ${isAI ? 'text-primary' : 'text-muted-foreground'}`}>
                {isAI ? 'Dr. Chetna 🤖' : msg.display_name}
              </span>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-tr-md'
                    : isAI
                    ? 'bg-primary/10 text-foreground border border-primary/20 rounded-tl-md'
                    : 'bg-muted text-foreground rounded-tl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-muted-foreground mt-1">
                {formatMessageTime(msg.created_at)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.length} people are typing...`}
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
