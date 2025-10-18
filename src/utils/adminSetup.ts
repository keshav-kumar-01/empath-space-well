
import { supabase } from '@/integrations/supabase/client';

export const addUserAsAdmin = async (userId: string) => {
  try {
    // First check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'Authentication required' };
    }

    // Check if current user has admin role
    const { data: currentUserRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleCheckError || !currentUserRole) {
      return { error: 'Only existing admins can add new admin users' };
    }

    // Insert admin role for the target user
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

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking admin status:', error);
      return { isAdmin: false, error };
    }

    const isAdmin = !!data;
    
    return { isAdmin, error: null };
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

// Helper function to securely check if user can access admin features
export const canAccessAdminFeatures = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { isAdmin } = await checkIsAdmin(user.id);
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};
