
import { supabase } from '@/integrations/supabase/client';

export const addUserAsAdmin = async (userEmail: string) => {
  try {
    // First, get the user ID from auth.users by email
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error fetching users:', getUserError);
      return { error: getUserError.message };
    }

    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
      return { error: 'User not found with that email' };
    }

    // Add user to admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { error: 'User is already an admin' };
      }
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Admin setup error:', error);
    return { error: 'Failed to add admin user' };
  }
};

// Helper function to check if current user is admin
export const checkIsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    return { isAdmin: !!data && !error, error };
  } catch (error) {
    return { isAdmin: false, error };
  }
};
