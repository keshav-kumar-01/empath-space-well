
import { supabase } from '@/integrations/supabase/client';

export const addUserAsAdmin = async (userId: string) => {
  try {
    console.log('Adding user as admin:', userId);
    // Insert admin role for the user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
      return { error: 'Failed to add admin role' };
    }

    console.log('User successfully added as admin');
    return { 
      data: { message: 'User successfully added as admin' }, 
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
    console.log('Checking admin status for:', { userId, userEmail });
    
    if (!userId) {
      console.log('No user ID provided, returning false');
      return { isAdmin: false, error: null };
    }

    // Query the user_roles table to check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false, error };
    }

    console.log('Admin role query result:', data);
    const isAdmin = data && data.length > 0;
    console.log('User is admin:', isAdmin);
    
    return { isAdmin, error: null };
  } catch (error) {
    console.error('Error in checkIsAdmin:', error);
    return { isAdmin: false, error };
  }
};

// Helper function to get user role
export const getUserRole = async (userId: string) => {
  try {
    console.log('Getting user role for:', userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user role:', error);
      return { role: 'user', error };
    }

    console.log('User role result:', data);
    return { role: data?.role || 'user', error: null };
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: 'user', error };
  }
};
