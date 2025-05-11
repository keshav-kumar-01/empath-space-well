
import { QuizQuestion, QuizResult } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'When faced with a difficult decision, you typically:',
    type: 'multiple-choice',
    options: [
      {
        id: 'q1-a',
        text: 'Consider how it will affect people\'s feelings',
        trait: 'emotional',
        value: 3
      },
      {
        id: 'q1-b',
        text: 'Analyze all data and potential outcomes',
        trait: 'analytical',
        value: 3
      },
      {
        id: 'q1-c',
        text: 'Ask friends or colleagues for their input',
        trait: 'social',
        value: 3
      },
      {
        id: 'q1-d',
        text: 'Think outside the box for unique solutions',
        trait: 'creative',
        value: 3
      }
    ]
  },
  {
    id: 'q2',
    question: 'At a social gathering, you\'re most likely to:',
    type: 'multiple-choice',
    options: [
      {
        id: 'q2-a',
        text: 'Listen attentively to someone sharing personal struggles',
        trait: 'emotional',
        value: 3
      },
      {
        id: 'q2-b',
        text: 'Engage in deep discussions about interesting topics',
        trait: 'analytical',
        value: 3
      },
      {
        id: 'q2-c',
        text: 'Connect people who might benefit from knowing each other',
        trait: 'social',
        value: 3
      },
      {
        id: 'q2-d',
        text: 'Share stories and ideas that inspire others',
        trait: 'creative',
        value: 3
      }
    ]
  },
  {
    id: 'q3',
    question: 'When stressed, you find relief by:',
    type: 'multiple-choice',
    options: [
      {
        id: 'q3-a',
        text: 'Talking through your feelings with someone you trust',
        trait: 'emotional',
        value: 3
      },
      {
        id: 'q3-b',
        text: 'Creating a plan to tackle the source of stress step-by-step',
        trait: 'analytical',
        value: 3
      },
      {
        id: 'q3-c',
        text: 'Spending time with supportive friends or family',
        trait: 'social',
        value: 3
      },
      {
        id: 'q3-d',
        text: 'Expressing yourself through art, writing, or other creative outlets',
        trait: 'creative',
        value: 3
      }
    ]
  },
  {
    id: 'q4',
    question: 'Your friends would describe you as:',
    type: 'multiple-choice',
    options: [
      {
        id: 'q4-a',
        text: 'Compassionate and understanding',
        trait: 'emotional',
        value: 3
      },
      {
        id: 'q4-b',
        text: 'Logical and insightful',
        trait: 'analytical',
        value: 3
      },
      {
        id: 'q4-c',
        text: 'Outgoing and supportive',
        trait: 'social',
        value: 3
      },
      {
        id: 'q4-d',
        text: 'Imaginative and original',
        trait: 'creative',
        value: 3
      }
    ]
  },
  {
    id: 'q5',
    question: 'When helping a friend through a crisis, you:',
    type: 'multiple-choice',
    options: [
      {
        id: 'q5-a',
        text: 'Listen carefully and validate their feelings',
        trait: 'emotional',
        value: 3
      },
      {
        id: 'q5-b',
        text: 'Help them break down the problem and find solutions',
        trait: 'analytical',
        value: 3
      },
      {
        id: 'q5-c',
        text: 'Rally your network to provide support',
        trait: 'social',
        value: 3
      },
      {
        id: 'q5-d',
        text: 'Offer fresh perspectives they might not have considered',
        trait: 'creative',
        value: 3
      }
    ]
  },
];

export const getQuizResult = (traits: Record<string, number>): QuizResult => {
  // Find the dominant trait
  const sortedTraits = Object.entries(traits).sort((a, b) => b[1] - a[1]);
  const primaryTrait = sortedTraits[0][0];
  const secondaryTrait = sortedTraits[1][0];
  
  // Determine personality type based on primary and secondary traits
  let personalityType: QuizResult['personalityType'];
  let description: string;
  let strengths: string[];
  let challenges: string[];
  let advice: string;
  let journalPrompt: string;
  
  if (primaryTrait === 'emotional') {
    personalityType = 'The Empath';
    description = 'You have a natural ability to understand and share the feelings of others. Your emotional intelligence allows you to connect deeply with people and offer genuine support during difficult times.';
    strengths = ['Deep empathy and compassion', 'Strong listening skills', 'Ability to build meaningful connections', 'Emotional awareness'];
    challenges = ['May absorb others\' emotional burdens', 'Risk of emotional burnout', 'Difficulty with setting boundaries'];
    advice = 'While your empathy is a gift, remember to protect your own emotional wellbeing. Practice mindfulness techniques to stay grounded when supporting others.';
    journalPrompt = 'Reflect on a time when your empathy helped someone. How did it make you feel? How might you balance supporting others while caring for yourself?';
  } else if (primaryTrait === 'analytical') {
    personalityType = 'The Strategist';
    description = 'You approach life with a logical mind and thoughtful analysis. You excel at breaking down complex problems and finding efficient solutions through careful consideration.';
    strengths = ['Clear logical thinking', 'Excellent problem-solving abilities', 'Thoughtful decision making', 'Ability to see long-term consequences'];
    challenges = ['May overthink situations', 'Could miss emotional nuances', 'Occasionally perceived as detached'];
    advice = 'Your analytical abilities are powerful, but remember to balance logic with emotional awareness. Try practicing empathetic listening alongside your problem-solving approach.';
    journalPrompt = 'Think about a recent decision you made. How did you analyze it? Were there emotional factors you considered or overlooked?';
  } else if (primaryTrait === 'social') {
    personalityType = 'The Connector';
    description = 'You thrive on building relationships and bringing people together. Your natural sociability and genuine interest in others creates community wherever you go.';
    strengths = ['Strong networking abilities', 'Authentic communication style', 'Ability to bring people together', 'Creating supportive environments'];
    challenges = ['May feel drained by too much alone time', 'Could prioritize others\' needs over your own', 'Risk of spreading yourself too thin socially'];
    advice = 'Your social skills bring value to many people\'s lives, but be sure to take time for self-reflection and recharging. Quality connections matter more than quantity.';
    journalPrompt = 'Consider your closest relationships. What makes them meaningful to you? How do you balance social connection with your personal needs?';
  } else {
    personalityType = 'The Innovator';
    description = 'You see the world through a unique lens, constantly finding new connections and possibilities. Your creative thinking helps you and others break free from conventional approaches.';
    strengths = ['Original thinking', 'Ability to reimagine possibilities', 'Adaptability to new situations', 'Inspiring others with fresh ideas'];
    challenges = ['May struggle with practical implementation', 'Sometimes misunderstood by more conventional thinkers', 'Could have difficulty focusing on details'];
    advice = 'Your creative perspective is invaluable. Partner with detail-oriented people to bring your ideas to life, and practice grounding techniques to help focus when needed.';
    journalPrompt = 'Describe a creative solution you developed recently. What inspired it? How did you overcome any obstacles to implementing it?';
  }
  
  // Special case for balanced traits - Harmonizer
  const highestValue = sortedTraits[0][1];
  const secondHighestValue = sortedTraits[1][1];
  
  if (highestValue - secondHighestValue < 2) {
    personalityType = 'The Harmonizer';
    description = 'You have a balanced personality that draws from multiple strengths. This versatility allows you to adapt to different situations and connect with diverse people through various approaches.';
    strengths = ['Versatility across situations', 'Balance of heart and mind', 'Adaptability to different people', 'Well-rounded perspective'];
    challenges = ['May sometimes lack a defined approach', 'Could struggle to identify your core strengths', 'Might second-guess which strategy to use'];
    advice = 'Your balanced nature is a strength. Embrace your adaptability while developing awareness of which approach serves best in different contexts.';
    journalPrompt = 'Reflect on a situation where you successfully balanced different approaches (emotional, analytical, social, creative). What made this integration effective?';
  }
  
  return {
    personalityType,
    traits: {
      emotional: traits.emotional,
      analytical: traits.analytical,
      social: traits.social,
      creative: traits.creative
    },
    description,
    strengths,
    challenges,
    advice,
    journalPrompt
  };
};
