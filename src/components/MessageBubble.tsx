
import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser, 
  timestamp 
}) => {
  return (
    <div className={cn(
      "flex items-end gap-3 animate-fade-in py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chetna-primary to-chetna-primary/80 flex items-center justify-center text-white font-semibold shadow-sm">
          C
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] p-4 rounded-2xl shadow-md",
          isUser 
            ? "bg-gradient-to-br from-chetna-primary to-chetna-primary/90 text-white rounded-tr-none" 
            : "bg-gradient-to-br from-white to-chetna-peach/30 dark:from-chetna-primary/20 dark:to-chetna-primary/10 text-chetna-dark dark:text-white rounded-tl-none"
        )}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
        <div className={cn(
          "text-xs mt-2 opacity-70 text-right",
          isUser ? "text-white/70" : "text-chetna-dark/70 dark:text-white/70"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chetna-accent to-chetna-accent/80 flex items-center justify-center text-chetna-dark font-semibold shadow-sm">
          U
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
