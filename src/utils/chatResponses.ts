
interface ChatResponse {
  trigger: string[];
  responses: string[];
}

export const sampleResponses: ChatResponse[] = [
  {
    trigger: ["hello", "hi", "hey", "greetings", "howdy", "hola"],
    responses: [
      "Hello! I'm Chetna, your mental wellness companion. How are you feeling today?",
      "Hi there! I'm here to listen and support you. How has your day been so far?",
      "Hey! I'm Chetna. I'm here to chat whenever you need support. How are you doing right now?",
      "Greetings! I'm so glad you reached out today. Would you like to share how you're feeling?",
      "Hello! It's wonderful to connect with you. I'm here to provide a safe space for you to express yourself."
    ]
  },
  {
    trigger: ["sad", "unhappy", "depressed", "down", "blue", "heartbroken", "devastated", "miserable"],
    responses: [
      "I'm sorry to hear you're feeling this way. Would you like to talk about what's making you feel sad?",
      "It's okay to feel sad sometimes. I'm here to listen if you'd like to share what's on your mind.",
      "I understand that feeling down can be really difficult. What do you think might have triggered these feelings?",
      "When we feel sad, it can sometimes feel like a heavy weight on our shoulders. I'm here to help lighten that burden by listening.",
      "Your feelings are valid, and it takes courage to acknowledge sadness. Would talking about specific situations help you process these emotions?",
      "Sadness is a natural part of life, but you don't have to face it alone. I'm here with you through this difficult time."
    ]
  },
  {
    trigger: ["anxious", "anxiety", "worried", "stress", "stressed", "panic", "overwhelming", "fear", "scared"],
    responses: [
      "Anxiety can be really challenging. Would it help to talk through what's making you feel anxious?",
      "I understand that anxiety can feel overwhelming. Have you tried any breathing exercises today?",
      "It's normal to feel stressed sometimes. Can you identify what specific things are causing you to feel this way?",
      "When anxiety takes hold, it can feel like you're losing control. Let's take a moment together - try taking a slow, deep breath.",
      "Your feelings of anxiety are valid, and I'm here to support you. Sometimes naming what we're afraid of can reduce its power over us.",
      "Anxiety often makes us focus on the future. Let's try to bring your attention gently back to the present moment. What can you see around you right now?",
      "The physical sensations of anxiety can be frightening, but they will pass. You're stronger than you realize in this moment."
    ]
  },
  {
    trigger: ["angry", "mad", "frustrated", "furious", "irritated", "annoyed", "rage", "outraged"],
    responses: [
      "It sounds like you're feeling frustrated. Would you like to talk about what happened?",
      "Anger is a natural emotion. Is there something specific that triggered these feelings?",
      "I understand feeling upset can be intense. Sometimes expressing these feelings can help process them.",
      "When we feel angry, our bodies respond with energy that needs somewhere to go. Would it help to talk about healthy ways to express this feeling?",
      "Your anger is trying to tell you something important. With some reflection, we might discover what boundary might have been crossed.",
      "It takes strength to acknowledge feelings of frustration. I appreciate you sharing this with me.",
      "Anger often masks deeper emotions like hurt or fear. Would it feel right to explore what might be beneath this feeling?"
    ]
  },
  {
    trigger: ["happy", "good", "great", "wonderful", "joy", "excited", "delighted", "content", "peaceful"],
    responses: [
      "I'm glad to hear you're feeling positive! What's contributed to your good mood today?",
      "That's wonderful! Celebrating these moments of joy is important. What made today special?",
      "I'm happy to hear that! Would you like to reflect on what's going well in your life right now?",
      "Joy is such a beautiful emotion to experience. How does this happiness show up in your body right now?",
      "It's lovely to hear you're in good spirits! These positive moments are worth savoring fully.",
      "What a wonderful feeling! Sometimes writing down happy moments helps us remember them during harder times.",
      "Your happiness brings me joy too! Is there something specific that sparked this positive feeling?"
    ]
  },
  {
    trigger: ["tired", "exhausted", "fatigue", "sleep", "drained", "burnout", "worn out"],
    responses: [
      "Feeling tired can affect our mental state significantly. Have you been able to get enough rest lately?",
      "Rest is so important for our wellbeing. What has your sleep schedule been like?",
      "Being exhausted can make everything harder. Are there any small tasks you could postpone to give yourself some rest?",
      "I hear that you're feeling drained. Sometimes our bodies and minds need extra care during these periods. What's one small way you could nurture yourself today?",
      "Burnout is a serious concern that affects both mind and body. What boundaries might need strengthening in your life?",
      "When we're exhausted, even small tasks can feel overwhelming. Be gentle with yourself right now - you deserve that compassion.",
      "Tiredness can sometimes be our body's way of asking for attention. What do you think your body might be trying to tell you?"
    ]
  },
  {
    trigger: ["thank", "thanks", "appreciate", "grateful"],
    responses: [
      "You're very welcome. I'm here for you anytime you need to talk.",
      "I'm glad I could help. Remember, taking time to talk about your feelings is an important part of self-care.",
      "It's my pleasure to be here for you. Is there anything else you'd like to discuss?",
      "I appreciate your kind words. Reaching out for support shows real strength and self-awareness.",
      "Thank you for trusting me with your thoughts and feelings. That trust means a lot to me.",
      "I'm honored to be part of your journey. Remember that you can return anytime you need support."
    ]
  },
  {
    trigger: ["help", "support", "advice", "guidance", "lost", "confused", "uncertain"],
    responses: [
      "I'm here to support you. What specific areas would you like guidance with?",
      "I'd be happy to help. Could you share a bit more about what you're going through?",
      "Supporting your mental wellbeing is important to me. Let's talk about what might help you right now.",
      "Sometimes feeling lost is part of finding a new path. Would you like to explore what options might be available to you?",
      "Uncertainty can be uncomfortable, but it also holds possibilities. I'm here to help you navigate through this feeling.",
      "It takes courage to ask for help. What kind of support would feel most helpful right now?",
      "I'm here to listen without judgment and offer perspective when I can. What's on your mind?"
    ]
  },
  {
    trigger: ["lonely", "alone", "isolated", "disconnected", "abandoned"],
    responses: [
      "Loneliness can be really painful. Would you like to talk about what's contributing to these feelings?",
      "Even though I'm an AI, I'm here with you in this moment. You're not completely alone right now.",
      "Many people experience feelings of isolation, though that doesn't make your experience any less valid. How long have you been feeling this way?",
      "Social connection is a fundamental human need. Have there been changes in your relationships recently?",
      "Sometimes we can feel lonely even when surrounded by others. Are you missing a certain type of connection?",
      "I hear that you're feeling isolated. That's a difficult emotion to sit with. I'm here to keep you company for as long as you need."
    ]
  },
  {
    trigger: ["overwhelmed", "too much", "can't cope", "struggling", "drowning"],
    responses: [
      "When we're overwhelmed, sometimes breaking things down into smaller steps can help. What's one tiny thing you could focus on right now?",
      "It's okay to feel overwhelmed. Your feelings are valid, and you won't feel this way forever.",
      "I understand that feeling of having too much to handle. Would it help to talk about what specifically feels most overwhelming?",
      "When we're struggling, sometimes our expectations of ourselves need adjusting. How would you speak to a friend in your situation?",
      "Taking things one breath at a time is sometimes all we can do. I'm here with you through this difficult moment.",
      "It's brave of you to acknowledge when things feel too much. That awareness itself is a form of strength."
    ]
  },
  {
    trigger: ["worthless", "failure", "useless", "not good enough", "disappoint"],
    responses: [
      "I want you to know that your worth isn't determined by your achievements or mistakes. You have inherent value as a person.",
      "Those feelings of worthlessness can be incredibly painful, but they aren't reflections of the truth about you.",
      "We all make mistakes and face failures - they're part of being human, not evidence of being a failure.",
      "The voice of self-criticism can be very harsh. Would you ever speak to someone you care about the way you speak to yourself?",
      "You matter, and your presence in this world has impact, even when you can't see it clearly.",
      "I hear how much pain you're in right now. These difficult feelings about yourself don't define who you truly are."
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
    "That's interesting. How does that make you feel?",
    "I notice you have a lot on your mind. Which aspect feels most important to discuss right now?",
    "Sometimes putting feelings into words can help us understand them better. Is there more you'd like to share?",
    "I'm here with you through whatever you're experiencing. Would you like to tell me more?",
    "Your experiences and feelings matter. What else would you like to talk about today?",
    "I'm listening attentively. Is there a specific aspect of this situation that's troubling you the most?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};
