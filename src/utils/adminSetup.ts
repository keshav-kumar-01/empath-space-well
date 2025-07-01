
import { supabase } from '@/integrations/supabase/client';

export const addUserAsAdmin = async (userEmail: string) => {
  try {
    // First, get the user by email
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail);

    if (userError) {
      console.error('Error finding user:', userError);
      return { error: 'Failed to find user' };
    }

    if (!users || users.length === 0) {
      return { error: 'User not found' };
    }

    const userId = users[0].id;

    // Insert admin role for the user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
      return { error: 'Failed to add admin role' };
    }

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
    if (!userId) {
      return { isAdmin: false, error: null };
    }

    // Query the user_roles table to check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking admin status:', error);
      return { isAdmin: false, error };
    }

    return { isAdmin: !!data, error: null };
  } catch (error) {
    console.error('Error in checkIsAdmin:', error);
    return { isAdmin: false, error };
  }
};

// Helper function to get user role
export const getUserRole = async (userId: string) => {
  try {
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

    return { role: data?.role || 'user', error: null };
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: 'user', error };
  }
};
