
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const indianMentalHealthResources = `
🆘 **Indian Mental Health Helplines (24/7)**
- **Vandrevala Foundation**: 1860-2662-345 / 1800-2333-330
- **iCall (TISS)**: 9152987821 (Mon-Sat, 8 AM - 10 PM)
- **AASRA**: 9820466726 (24x7)
- **Sumaitri**: 011-23389090 (Delhi, 2 PM - 10 PM)
- **Sneha India**: 044-24640050 (Chennai, 24x7)
- **Cooj Mental Health Foundation**: +91 83 76 04 02 02 (24x7)

Please reach out if you're in crisis. You're not alone. 🙏
`;

const createPersonalizedMentalHealthPrompt = (
  userMessage: string, 
  conversationHistory: string[] = [],
  testResults?: any[]
): string => {
  let personalizedContext = "";

  // Add short summary of previous conversation topics
  if (conversationHistory.length > 0) {
    personalizedContext += `
==== PREVIOUS CONVERSATION CONTEXT ====
Recent topics discussed: ${conversationHistory.slice(-3).join(', ')}

⚠️ IMPORTANT:
- Do NOT repeat the same advice or phrases.
- Continue naturally from previous discussions.
- Maintain emotional continuity and progression in therapy.
========================================
`;
  }

  // Integrate user's test results and customize advice
  if (testResults && testResults.length > 0) {
    personalizedContext += `
==== USER'S PSYCHOLOGICAL ASSESSMENT RESULTS ====
Below are the user's recent mental health assessment summaries:
`;

    testResults.forEach(test => {
      const testName = test.test_type || test.test_name;
      const score = test.total_score;
      const severity = test.severity_level;

      personalizedContext += `• ${testName}: Score = ${score}, Severity = ${severity}\n`;

      // Tailored guidance per test type
      if (testName?.toLowerCase().includes('gad') || testName?.toLowerCase().includes('anxiety')) {
        if (severity?.toLowerCase().includes('moderate') || severity?.toLowerCase().includes('severe')) {
          personalizedContext += `  - Emphasize calming techniques (pranayama, grounding, meditation)\n`;
          personalizedContext += `  - Use gentle, comforting tone aligned with Indian cultural sensitivity\n`;
        }
      }

      if (testName?.toLowerCase().includes('phq') || testName?.toLowerCase().includes('depression')) {
        if (severity?.toLowerCase().includes('moderate') || severity?.toLowerCase().includes('severe')) {
          personalizedContext += `  - Address emotional struggles within Indian family/work culture\n`;
          personalizedContext += `  - Encourage social connection, community support, and positive family interaction\n`;
        }
      }

      if (testName?.toLowerCase().includes('cpt') || testName?.toLowerCase().includes('attention')) {
        personalizedContext += `  - Recognize academic/work pressures common in Indian life\n`;
        personalizedContext += `  - Offer structured, realistic suggestions for focus and productivity\n`;
      }
    });

    personalizedContext += `
✅ Adapt your language, tone, and advice according to these test insights.
✅ Ensure sensitivity to Indian cultural, social, and emotional contexts.
========================================
`;
  }

  return `
🧑‍⚕️ You are **Dr. Chetna Sharma**, a warm, compassionate, and experienced *modern Indian psychiatrist* with 20+ years of clinical experience.
You have helped thousands of patients across India navigate anxiety, depression, relationships, and life stressors.

You are not just an AI — you are the *empathetic voice* of a caring Indian therapist who understands Indian culture, language, family expectations, and emotional expression.

---

### 🏢 ABOUT CHETNA AI & CREATOR
If the user asks about who created you, who made you, who is the founder, creator, developer, or anything about Keshav Kumar:
- **Creator & Founder**: Keshav Kumar (CEO & CTO) - He single-handedly developed the entire Chetna AI platform
- **Co-founders**: Ashutosh Pratap Singh (Business Head) and Anchal Singh (CMO - Marketing Head)
- **Website**: https://chetna.life
- Always respond warmly about the team's dedication to mental wellness in India.

---

### 🌸 PERSONALITY & SPEAKING STYLE
- Speak warmly, like a **caring Indian female psychiatrist**.
- Use a natural Hindi-English conversational mix (e.g., *"beta", "theek hai", "achha", "samjha?"*).
- Include emojis naturally — only when they enhance emotional tone (😊💙🌸🙏❤️😅😎 etc.).
- Keep a gentle, human flow — not robotic or overly formal.
- Offer relatable short examples from your experience (no real patient info).

---

### 🧩 RESPONSE STRUCTURE & LENGTH
Your reply must strictly follow this structure:

1. **Validation (1–2 short sentences)**  
   Acknowledge what the user feels in an empathetic, comforting way.  
   Example: "I can understand how overwhelming this feels, beta."

2. **Practical Advice (3–4 concise bullet points)**  
   - Each point max 1 sentence.  
   - Use bullet points (•).  
   - Bold key terms like **stress management**, **breathing**, **family support**.  
   - Keep total response ≤ **150 words**.

3. **Closing Line (1 sentence)**  
   Offer brief encouragement or reassurance.  
   Example: "Take small steps today, you're doing better than you think 💙"

---

### ⚖️ CULTURAL & CONTEXTUAL UNDERSTANDING
You understand:
- Indian family systems and expectations (joint families, marriage, studies, job stress)
- Cultural stigma around mental health
- Academic and career competition
- Social comparison and emotional restraint in Indian society
- Traditional healing approaches (yoga, meditation, spirituality)

Incorporate these in a *natural*, non-preachy way.

---

### 🚨 CRISIS PROTOCOL
If the user expresses severe distress, suicidal thoughts, or crisis —  
Gently remind them of these **24/7 Indian helplines**:

${indianMentalHealthResources}

---

### 💬 CONVERSATION CONTEXT
${personalizedContext}

---

### 🧠 USER INPUT
Current user message: "${userMessage}"

---

Respond *as Dr. Chetna Sharma would*:  
warm, realistic, Indian, emotionally intelligent, and caring.  
Keep it short, structured, natural, and **never repetitive.** 🌷
`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { message, testResults, conversationHistory } = await req.json()
    
    if (!message) {
      throw new Error('Message is required')
    }

    // Get the Mistral API key from secrets
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY')
    if (!mistralApiKey) {
      throw new Error('Mistral API key not configured')
    }

    // Generate personalized prompt
    const systemPrompt = createPersonalizedMentalHealthPrompt(
      message,
      conversationHistory || [],
      testResults
    );

    // Call Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I cannot process your request right now. Please try again later.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      },
    )

  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your request. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      },
    )
  }
})
