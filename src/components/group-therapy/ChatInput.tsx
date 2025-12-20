import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  onTypingChange: (isTyping: boolean) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTypingChange,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicator
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notify typing started
    onTypingChange(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    onTypingChange(false);

    const success = await onSendMessage(message);
    
    if (success) {
      setMessage('');
      // Focus textarea after sending
      textareaRef.current?.focus();
    }

    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick mood reactions
  const moodReactions = ['❤️', '🤗', '💪', '🙏', '✨'];

  const addReaction = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Quick reactions */}
      <div className="flex gap-2 mb-3">
        {moodReactions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addReaction(emoji)}
            className="text-xl hover:scale-125 transition-transform"
            disabled={disabled}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Share how you're feeling... (Enter to send)"
            className="min-h-[48px] max-h-[120px] resize-none pr-10 bg-muted/50 border-border focus:border-primary"
            disabled={disabled}
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending || disabled}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Your identity is protected with an anonymous name 🔒
      </p>
    </div>
  );
};

export default ChatInput;
