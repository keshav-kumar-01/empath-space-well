
import { supabase } from '@/integrations/supabase/client';

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    console.log('Sending message to AI service:', message);
    
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    // Call the secure Edge Function instead of direct API call
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { message },
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
