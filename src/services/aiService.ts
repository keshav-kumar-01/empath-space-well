
import { pipeline } from "@huggingface/transformers";

let modelInitialized = false;
let generator: any = null;

// Mental health model ID - we're using a small instruction-tuned model
// that works well in the browser
const MODEL_ID = "Xenova/distilbert-base-uncased-finetuned-mental-health";

// Initialize the model
export const initModel = async (): Promise<void> => {
  try {
    if (!modelInitialized) {
      console.log("Initializing AI model...");
      // Use text-generation pipeline with our model
      generator = await pipeline(
        "text-classification", 
        MODEL_ID,
        { device: "cpu" } // Use CPU for compatibility
      );
      modelInitialized = true;
      console.log("AI model initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing AI model:", error);
    // If model fails to load, we'll fallback to predefined responses
  }
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
    const prompt = `User: ${userMessage}\nAssistant: `;
    
    // Get response from model
    const result = await generator(prompt, { 
      max_length: 150,
      temperature: 0.7,
      top_p: 0.9
    });

    // Check if we got a valid response
    if (result && result.length > 0) {
      return result[0].generated_text.replace(prompt, "").trim();
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
