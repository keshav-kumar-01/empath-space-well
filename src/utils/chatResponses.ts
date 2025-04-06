
interface ChatResponse {
  trigger: string[];
  responses: string[];
}

export const sampleResponses: ChatResponse[] = [
  {
    trigger: ["hello", "hi", "hey", "greetings"],
    responses: [
      "Hello! I'm Chetna, your mental wellness companion. How are you feeling today?",
      "Hi there! I'm here to listen and support you. How has your day been so far?",
      "Hey! I'm Chetna. I'm here to chat whenever you need support. How are you doing right now?"
    ]
  },
  {
    trigger: ["sad", "unhappy", "depressed", "down"],
    responses: [
      "I'm sorry to hear you're feeling this way. Would you like to talk about what's making you feel sad?",
      "It's okay to feel sad sometimes. I'm here to listen if you'd like to share what's on your mind.",
      "I understand that feeling down can be really difficult. What do you think might have triggered these feelings?"
    ]
  },
  {
    trigger: ["anxious", "anxiety", "worried", "stress", "stressed"],
    responses: [
      "Anxiety can be really challenging. Would it help to talk through what's making you feel anxious?",
      "I understand that anxiety can feel overwhelming. Have you tried any breathing exercises today?",
      "It's normal to feel stressed sometimes. Can you identify what specific things are causing you to feel this way?"
    ]
  },
  {
    trigger: ["angry", "mad", "frustrated"],
    responses: [
      "It sounds like you're feeling frustrated. Would you like to talk about what happened?",
      "Anger is a natural emotion. Is there something specific that triggered these feelings?",
      "I understand feeling upset can be intense. Sometimes expressing these feelings can help process them."
    ]
  },
  {
    trigger: ["happy", "good", "great", "wonderful"],
    responses: [
      "I'm glad to hear you're feeling positive! What's contributed to your good mood today?",
      "That's wonderful! Celebrating these moments of joy is important. What made today special?",
      "I'm happy to hear that! Would you like to reflect on what's going well in your life right now?"
    ]
  },
  {
    trigger: ["tired", "exhausted", "fatigue", "sleep"],
    responses: [
      "Feeling tired can affect our mental state significantly. Have you been able to get enough rest lately?",
      "Rest is so important for our wellbeing. What has your sleep schedule been like?",
      "Being exhausted can make everything harder. Are there any small tasks you could postpone to give yourself some rest?"
    ]
  },
  {
    trigger: ["thank", "thanks", "appreciate"],
    responses: [
      "You're very welcome. I'm here for you anytime you need to talk.",
      "I'm glad I could help. Remember, taking time to talk about your feelings is an important part of self-care.",
      "It's my pleasure to be here for you. Is there anything else you'd like to discuss?"
    ]
  },
  {
    trigger: ["help", "support", "advice"],
    responses: [
      "I'm here to support you. What specific areas would you like guidance with?",
      "I'd be happy to help. Could you share a bit more about what you're going through?",
      "Supporting your mental wellbeing is important to me. Let's talk about what might help you right now."
    ]
  }
];

export const getResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  // Find a matching response category
  for (const category of sampleResponses) {
    if (category.trigger.some(trigger => lowercaseMessage.includes(trigger))) {
      const randomIndex = Math.floor(Math.random() * category.responses.length);
      return category.responses[randomIndex];
    }
  }
  
  // Default responses if no match is found
  const defaultResponses = [
    "I'm here to listen. Could you tell me more about how you're feeling?",
    "Thank you for sharing. Would you like to explore this further?",
    "I appreciate you opening up. How long have you been feeling this way?",
    "I'm here to support you. What do you think might help in this situation?",
    "That's interesting. How does that make you feel?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};
