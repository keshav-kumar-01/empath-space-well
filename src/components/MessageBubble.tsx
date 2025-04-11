
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
      "flex items-end gap-2 animate-fade-in py-1.5",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold shadow-sm">
          C
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] p-4 rounded-2xl shadow-sm",
          isUser 
            ? "bg-chetna-primary text-white rounded-tr-none" 
            : "bg-chetna-ai-bubble dark:bg-chetna-primary/20 text-chetna-dark dark:text-white rounded-tl-none"
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
        <div className="w-8 h-8 rounded-full bg-chetna-accent flex items-center justify-center text-chetna-dark font-semibold shadow-sm">
          U
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
