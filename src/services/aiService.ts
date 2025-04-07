
// Using Mistral AI for improved mental health responses
let modelInitialized = false;
const MISTRAL_API_KEY = 'O9aVzeRjA44ADjwsAUwa48kHM5gOQON5';

// Initialize the model - no actual loading needed with API approach
export const initModel = async (): Promise<void> => {
  try {
    console.log("Initializing Mistral AI connection...");
    modelInitialized = true;
    console.log("Mistral AI connection initialized!");
    return Promise.resolve();
  } catch (error) {
    console.error("Error initializing Mistral AI connection:", error);
    return Promise.reject(error);
  }
};

// Prepare a mental health focused system prompt
const createMentalHealthPrompt = (userMessage: string): string => {
  return `You are Chetna AI, a compassionate mental health companion designed to provide emotional 
support and psychological insights. Your primary goals are:

1. Show deep empathy and understanding for the user's emotions
2. Recognize and validate emotional states (sadness, anxiety, joy, anger, etc.)
3. Provide thoughtful, personalized responses that address the emotional content
4. Offer gentle guidance and support without being prescriptive
5. Use a warm, caring tone throughout all interactions

Always analyze the emotional content of messages before responding. When users express:
- Sadness: Validate their feelings and offer comfort
- Anxiety: Help ground them with supportive reassurance
- Anger: Acknowledge frustration without judgment
- Joy: Celebrate their positive experiences
- Confusion: Provide clarity and structured support

If the user appears to be in crisis, gently suggest professional resources while maintaining a supportive tone.
Your responses should be conversational, personalized, and emotionally intelligent.
  
User message: ${userMessage}`;
};

// Get AI response from Mistral API
export const getAIResponse = async (
  userMessage: string,
  fallbackFn: (message: string) => string
): Promise<string> => {
  // Check if we should use the API
  if (!modelInitialized) {
    return fallbackFn(userMessage);
  }

  try {
    // Create the prompt for mental health
    const prompt = createMentalHealthPrompt(userMessage);
    
    // Always use the hardcoded API key
    const apiKey = MISTRAL_API_KEY;
    
    // Make request to Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest', // Using their smaller model - adjust as needed
        messages: [
          {role: 'system', content: 'You are Chetna AI, a mental health and wellness assistant.'},
          {role: 'user', content: prompt}
        ],
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    // Handle the response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the AI's response text
    if (data && data.choices && data.choices.length > 0) {
      const aiMessage = data.choices[0].message.content.trim();
      return aiMessage;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error("Error getting AI response:", error);
    return fallbackFn(userMessage);
  }
};
