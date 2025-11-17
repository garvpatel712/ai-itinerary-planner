import { supabase } from './supabaseClient';

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  // Create user profile if signup was successful
  if (!error && data?.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: data.user.id,
          email: email,
          name: email.split('@')[0], // Use part before @ as default name
          role: 'user'
        }
      ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't return the profile error to the user, let them proceed with login
    }
  }

  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  // Check if this is an admin login
  if (!error && data?.user) {
    const isAdmin = email === 'admin@gmail.com' && password === 'admin@1234';
    
    if (isAdmin) {
      // Update user profile with admin role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('user_id', data.user.id);
      
      if (profileError) {
        console.error('Error updating admin role:', profileError);
      }
    }
  }
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

// Function to ensure user has a profile (for existing users)
export const ensureUserProfile = async (userId: string, email: string) => {
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  // Create profile if it doesn't exist
  if (!existingProfile) {
    const { error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          email: email,
          name: email.split('@')[0],
          role: 'user'
        }
      ]);

    if (error) {
      console.error('Error creating user profile:', error);
      return { error };
    }
  }

  return { error: null };
};