import type { User } from '@supabase/supabase-js';
import { ADMIN_EMAILS } from '@/config/admin';

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  return ADMIN_EMAILS.map((x) => x.toLowerCase().trim()).includes(e);
};

export const inferUserType = (
  user: User | null
): 'individual' | 'establishment' | 'promoter' | 'admin' => {
  if (!user) return 'individual';
  
  // First check user metadata for user_type
  const meta = user.user_metadata?.user_type as
    | 'individual'
    | 'establishment'
    | 'promoter'
    | 'admin'
    | undefined;
  
  // Trust metadata if it's a valid type, especially for admin
  if (meta === 'admin' || meta === 'establishment' || meta === 'promoter') {
    return meta;
  }
  
  // Secondary check for admin emails (if configured)
  if (isAdminEmail(user.email)) return 'admin';
  
  // Default to individual
  return 'individual';
};
