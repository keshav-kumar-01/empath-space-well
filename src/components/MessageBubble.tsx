
import React from "react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, timestamp }) => {
  if (isUser) {
    return (
      <div className="flex items-end gap-2 justify-end">
        <div className="bg-chetna-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-soft">
          <p className="text-sm leading-relaxed break-words">{message}</p>
          <div className="text-xs text-white/80 mt-1">
            {format(timestamp, "HH:mm")}
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs shrink-0">
          You
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-6 h-6 rounded-full bg-chetna-primary flex items-center justify-center text-white font-semibold text-xs shrink-0">
        C
      </div>
      <div className="bg-chetna-ai-bubble dark:bg-chetna-primary/30 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-soft">
        <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 prose prose-sm max-w-none break-words">
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="font-bold text-chetna-primary dark:text-chetna-primary">{children}</strong>
              ),
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-1 my-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start">
                  <span className="text-chetna-primary mr-2 mt-1">•</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {format(timestamp, "HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
