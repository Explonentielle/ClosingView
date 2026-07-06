import { supabase } from '@/integrations/supabase/client';
import { getAuthRedirectUrl, getResetPasswordUrl, getGoogleRedirectUrl } from '@/lib/config';
import type { Session } from '@supabase/supabase-js';

export async function getCurrentSession(): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

export async function signUp(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error);
    return false;
  }

  return true;
}

export async function signIn(email: string, password: string): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  return session ?? null;
}

export async function signOut(): Promise<boolean> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return false;
  }

  return true;
}

export async function signInWithGoogle(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getGoogleRedirectUrl(),
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      return null;
    }

    return data.session;
  } catch (err) {
    console.error('Google OAuth error:', err);
    return null;
  }
}

export async function resetPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getResetPasswordUrl(),
    });

    if (error) {
      console.error('Error sending reset email:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Reset password error:', err);
    return false;
  }
}

export async function updatePassword(newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error updating password:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Update password error:', err);
    return false;
  }
}
