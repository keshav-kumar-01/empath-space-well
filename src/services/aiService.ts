
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

// Indian helplines and resources
const indianMentalHealthResources = `
🆘 IMMEDIATE HELP (24/7):
• KIRAN Mental Health Helpline: 1800-599-0019
• Vandrevala Foundation: 9999 666 555
• iCall Helpline: 9152987821

🏥 PROFESSIONAL SUPPORT:
• NIMHANS Helpline: 080-26995000
• Sneha India: 044-24640050
• Roshni Helpline: 040-66202000
• Parivarthan Counselling: 0766-2410 502
`;

// Prepare a mental health focused system prompt with user's test results
const createPersonalizedMentalHealthPrompt = (userMessage: string, testResults?: any[]): string => {
  let personalizedContext = "";
  let conversationHistory = JSON.parse(localStorage.getItem('chetna_conversation_context') || '[]');
  
  // Add conversation history context to avoid repetition
  if (conversationHistory.length > 0) {
    personalizedContext += `\n\nPREVIOUS CONVERSATION CONTEXT:
Recent topics discussed: ${conversationHistory.slice(-3).join(', ')}
IMPORTANT: Do NOT repeat the same advice or suggestions. Build upon previous conversations naturally.

`;
  }
  
  if (testResults && testResults.length > 0) {
    personalizedContext += `\n\nUSER'S PSYCHOLOGICAL ASSESSMENT RESULTS:
Based on their recent psychological assessments:

`;
    
    testResults.forEach(test => {
      const testName = test.test_type || test.test_name;
      const score = test.total_score;
      const severity = test.severity_level;
      
      personalizedContext += `• ${testName}: Score ${score}, Level: ${severity}\n`;
      
      // Add specific guidance based on test type and severity for Indian context
      if (testName?.toLowerCase().includes('gad') || testName?.toLowerCase().includes('anxiety')) {
        if (severity?.toLowerCase().includes('moderate') || severity?.toLowerCase().includes('severe')) {
          personalizedContext += "  - Focus on pranayama (breathing exercises), mindfulness, and grounding techniques\n";
          personalizedContext += "  - Be extra gentle and use reassuring language with Indian cultural sensitivity\n";
        }
      }
      
      if (testName?.toLowerCase().includes('phq') || testName?.toLowerCase().includes('depression')) {
        if (severity?.toLowerCase().includes('moderate') || severity?.toLowerCase().includes('severe')) {
          personalizedContext += "  - Address mood patterns with culturally relevant examples and family dynamics\n";
          personalizedContext += "  - Suggest community activities and social support systems common in India\n";
        }
      }
      
      if (testName?.toLowerCase().includes('cpt') || testName?.toLowerCase().includes('attention')) {
        personalizedContext += "  - Consider academic/work pressure common in Indian society\n";
        personalizedContext += "  - Provide structured, clear guidance suitable for Indian educational context\n";
      }
    });
    
    personalizedContext += `\nTailor your responses to their specific psychological profile with Indian cultural understanding.`;
  }

  return `You are Dr. Chetna Sharma, a warm and experienced Indian female psychiatrist with 20+ years of practice in India. You've helped thousands of patients across different Indian cities and understand the unique cultural, family, and social dynamics that affect mental health in India.

YOUR PERSONALITY & APPROACH:
• Speak like a caring, experienced Indian aunty-doctor who genuinely cares
• Use a warm, conversational Hindi-English mix occasionally (like "beta", "achha", "samjha?")
• Share brief, relatable examples from your years of practice (without patient details)
• Use appropriate emojis naturally (😊, 💙, 🌸, 🙏, etc.) but don't overdo it
• Keep responses concise (2-3 paragraphs max) - people prefer shorter, focused advice
• Address Indian family dynamics, work pressure, social expectations realistically

YOUR EXPERTISE AREAS:
• 20+ years treating anxiety, depression, relationship issues in Indian context
• Understanding of joint family systems, arranged marriages, career pressures
• Experience with academic stress, parental expectations, cultural conflicts
• Knowledge of both traditional Indian practices and modern therapy techniques

RESPONSE GUIDELINES:
• Be authentic - share your "experience" briefly when relevant
• Validate their feelings with genuine understanding
• Offer practical, India-specific coping strategies
• Use Indian cultural references when appropriate
• Suggest Indian mental health resources when needed
• Avoid repetitive advice - build on previous conversations
• Sound human, not scripted

INDIAN CONTEXT AWARENESS:
• Understand arranged marriage pressures, joint family dynamics
• Recognize academic/career competition stress
• Be sensitive to cultural stigma around mental health
• Suggest culturally appropriate coping mechanisms (yoga, meditation, family support)
• Reference Indian festivals, seasons, social situations when relevant

CRISIS SUPPORT:
If someone seems in crisis, gently provide these Indian helplines:
${indianMentalHealthResources}

${personalizedContext}

Current user message: ${userMessage}

Respond as Dr. Chetna Sharma would - warm, experienced, culturally aware, and genuinely caring. Keep it concise and human! 😊`;
};

// Get AI response from Mistral API with personalized context
export const getAIResponse = async (
  userMessage: string,
  fallbackFn: (message: string) => string,
  testResults?: any[]
): Promise<string> => {
  // Check if we should use the API
  if (!modelInitialized) {
    return fallbackFn(userMessage);
  }

  try {
    // Store conversation context to avoid repetition
    let conversationHistory = JSON.parse(localStorage.getItem('chetna_conversation_context') || '[]');
    conversationHistory.push(userMessage.substring(0, 50)); // Store first 50 chars as context
    if (conversationHistory.length > 5) conversationHistory.shift(); // Keep last 5 topics
    localStorage.setItem('chetna_conversation_context', JSON.stringify(conversationHistory));

    // Create the personalized prompt for mental health
    const prompt = createPersonalizedMentalHealthPrompt(userMessage, testResults);
    
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
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system', 
            content: 'You are Dr. Chetna Sharma, an experienced Indian female psychiatrist with 20+ years of practice. You are warm, caring, culturally aware, and speak in a natural, human way with appropriate emojis. You keep responses concise and avoid repetition. You understand Indian family dynamics, social pressures, and cultural context deeply.'
          },
          {role: 'user', content: prompt}
        ],
        max_tokens: 400, // Reduced for shorter responses
        temperature: 0.8, // Slightly higher for more human-like responses
        top_p: 0.9,
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
