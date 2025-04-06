
import { pipeline } from "@huggingface/transformers";

let modelInitialized = false;
let generator: any = null;

// Using a larger model that's better for mental health conversations
// This model is specifically chosen for its mental health capabilities
const MODEL_ID = "microsoft/BioGPT-Large-PubMedQA";

// Initialize the model
export const initModel = async (): Promise<void> => {
  try {
    if (!modelInitialized) {
      console.log("Initializing AI model...");
      
      // Use text-generation pipeline with our model
      generator = await pipeline(
        "text-generation", 
        MODEL_ID,
        { 
          device: "cpu",
          max_new_tokens: 150,
        }
      );
      
      modelInitialized = true;
      console.log("AI model initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing AI model:", error);
    // If model fails to load, we'll fallback to predefined responses
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
  
  User: ${userMessage}
  
  Chetna:`;
};

// Get AI response based on user input
export const getAIResponse = async (
  userMessage: string,
  fallbackFn: (message: string) => string
): Promise<string> => {
  // If model isn't initialized or fails, use fallback
  if (!modelInitialized || !generator) {
    return fallbackFn(userMessage);
  }

  try {
    // Create a prompt that guides the model for mental health support
    const prompt = createMentalHealthPrompt(userMessage);
    
    // Get response from model
    const result = await generator(prompt, { 
      max_length: 250,
      min_length: 50,
      temperature: 0.7,
      top_p: 0.92,
      top_k: 50,
      repetition_penalty: 1.2,
      no_repeat_ngram_size: 3
    });

    // Process the generated text
    if (result && result.length > 0) {
      // Extract just the assistant's response
      let response = result[0].generated_text;
      
      // Remove the prompt part
      response = response.substring(prompt.length).trim();
      
      // Clean up any incomplete sentences or trailing text
      const lastSentenceEnd = Math.max(
        response.lastIndexOf("."), 
        response.lastIndexOf("?"), 
        response.lastIndexOf("!")
      );
      
      if (lastSentenceEnd > 0 && lastSentenceEnd < response.length - 1) {
        response = response.substring(0, lastSentenceEnd + 1);
      }
      
      return response;
    } else {
      // Fallback to predefined responses if model returns empty result
      return fallbackFn(userMessage);
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    // Fallback to predefined responses if model fails
    return fallbackFn(userMessage);
  }
};
