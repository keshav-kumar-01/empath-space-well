
import { supabase } from '@/integrations/supabase/client';

// Legacy function for backward compatibility
export const initModel = async (): Promise<void> => {
  console.log('AI model initialization (using Edge Function)');
  return Promise.resolve();
};

// Legacy function for backward compatibility  
export const getAIResponse = async (
  message: string, 
  fallbackFn?: (message: string) => string,
  userTestResults?: any[]
): Promise<string> => {
  return generateAIResponse(message);
};

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    console.log('Sending message to AI service:', message);
    
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    // Fetch user's test results
    const { data: testResults } = await supabase
      .from('psychological_test_results')
      .select('test_type, test_name, total_score, severity_level')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get conversation history from localStorage
    const conversationHistory = JSON.parse(
      localStorage.getItem('chetna_conversation_context') || '[]'
    );

    // Update conversation history with current topic
    const updatedHistory = [...conversationHistory, message].slice(-10); // Keep last 10 topics
    localStorage.setItem('chetna_conversation_context', JSON.stringify(updatedHistory));

    // Call the secure Edge Function with personalized data
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { 
        message,
        testResults: testResults || [],
        conversationHistory: updatedHistory
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (!data?.response) {
      throw new Error('Invalid response from AI service');
    }

    console.log('AI response received:', data.response);
    return data.response;

  } catch (error) {
    console.error('AI service error:', error);
    
    // Provide fallback responses for common scenarios
    if (error.message?.includes('Authentication required')) {
      return "I'm here to help! Please log in to continue our conversation and access personalized mental health support.";
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return "I'm experiencing some connectivity issues right now. Please check your internet connection and try again in a moment.";
    }
    
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a few moments, and if the problem persists, our support team is here to help.";
  }
};
