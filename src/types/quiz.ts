
export type QuizOption = {
  id: string;
  text: string;
  trait: keyof PersonalityTraits;
  value: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'multiple-choice' | 'likert-scale' | 'scenario' | 'visual';
  options: QuizOption[];
};

export type PersonalityTraits = {
  emotional: number;
  analytical: number;
  social: number;
  creative: number;
};

export type PersonalityType = 
  | 'The Empath'
  | 'The Strategist'
  | 'The Connector'
  | 'The Innovator'
  | 'The Harmonizer';

export type QuizResult = {
  personalityType: PersonalityType;
  traits: PersonalityTraits;
  description: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  journalPrompt: string;
};
