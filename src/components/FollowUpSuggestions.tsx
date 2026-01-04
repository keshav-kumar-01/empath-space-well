import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions,
  onSelect,
  isVisible
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="text-xs text-muted-foreground flex items-center gap-1 w-full mb-1">
        <MessageCircle className="h-3 w-3" />
        Follow-up questions:
      </span>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          className="text-xs h-auto py-1.5 px-3 bg-background/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-full whitespace-normal text-left"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default FollowUpSuggestions;

// Utility to generate follow-up suggestions based on context
export const generateFollowUps = (lastMessage: string, context?: string): string[] => {
  const lowerMessage = lastMessage.toLowerCase();
  
  // Dream-related follow-ups
  if (context === 'dream' || lowerMessage.includes('dream')) {
    return [
      "What does this dream symbol mean?",
      "How can I remember my dreams better?",
      "Is this dream recurring?",
      "What emotions did I feel in this dream?"
    ];
  }
  
  // Anxiety-related follow-ups
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    return [
      "What breathing exercises can help?",
      "How do I ground myself?",
      "When should I seek professional help?",
      "What are common triggers?"
    ];
  }
  
  // Depression-related follow-ups
  if (lowerMessage.includes('depress') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
    return [
      "What are small steps I can take today?",
      "How can I improve my sleep?",
      "What activities might help my mood?",
      "Should I talk to someone?"
    ];
  }
  
  // Stress-related follow-ups
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('pressure')) {
    return [
      "What relaxation techniques work best?",
      "How can I manage my time better?",
      "What are healthy coping strategies?",
      "How do I set boundaries?"
    ];
  }
  
  // Sleep-related follow-ups
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
    return [
      "What is good sleep hygiene?",
      "How can I quiet my mind at night?",
      "What bedtime routine helps?",
      "Should I avoid screens before bed?"
    ];
  }
  
  // Relationship-related follow-ups
  if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('family')) {
    return [
      "How do I communicate better?",
      "What are healthy boundaries?",
      "How do I handle conflict?",
      "When is couples therapy helpful?"
    ];
  }
  
  // Default general mental health follow-ups
  return [
    "Tell me more about this",
    "What coping strategies do you suggest?",
    "How can I practice self-care?",
    "What should I do next?"
  ];
};
