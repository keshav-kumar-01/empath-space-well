
import { supabase } from '@/integrations/supabase/client';

export const addUserAsAdmin = async (userEmail: string) => {
  try {
    // For now, we'll use a simple approach that doesn't rely on the admin_users table
    // due to TypeScript type constraints
    console.log(`Adding user ${userEmail} as admin - feature coming soon`);
    
    // This would normally add the user to the admin_users table
    // but we need to wait for the database types to be updated
    
    return { 
      data: { message: 'Admin feature will be available once database types are synced' }, 
      error: null 
    };
  } catch (error) {
    console.error('Admin setup error:', error);
    return { error: 'Failed to add admin user' };
  }
};

// Helper function to check if current user is admin
export const checkIsAdmin = async (userId?: string, userEmail?: string) => {
  try {
    // Check by user ID first (most reliable)
    if (userId === '62529ac4-eaf2-4fa8-bca1-b6c0938478f1') {
      return { isAdmin: true, error: null };
    }
    
    // Fallback to email check
    if (userEmail === 'keshavkumarhf@gmail.com' || userEmail === 'admin@example.com') {
      return { isAdmin: true, error: null };
    }
    
    return { isAdmin: false, error: null };
  } catch (error) {
    return { isAdmin: false, error };
  }
};
