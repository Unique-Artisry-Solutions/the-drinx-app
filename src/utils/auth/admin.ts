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
  const meta = user.user_metadata?.user_type as
    | 'individual'
    | 'establishment'
    | 'promoter'
    | 'admin'
    | undefined;
  const normalized = meta === 'establishment' || meta === 'promoter' || meta === 'admin' ? meta : 'individual';
  if (isAdminEmail(user.email)) return 'admin';
  return normalized || 'individual';
};
