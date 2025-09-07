import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { isAdmin as checkIsAdmin } from '@/utils/auth/admin';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error('[auth] getSession failed', error);
        setState((s) => ({ ...s, session: null, user: null, loading: false, isAdmin: false }));
        return;
      }

      const session = data.session ?? null;
      const user = session?.user ?? null;

      // default to non-admin; upgrade after DB check
      setState({ session, user, loading: false, isAdmin: false });

      if (user?.id) {
        try {
          const admin = await checkIsAdmin(user.id, user.email ?? null);
          if (!mounted) return;
          setState((s) => ({ ...s, isAdmin: !!admin }));
        } catch (e) {
          console.error('[auth] admin check failed', e);
        }
      }
    }

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      const session = newSession ?? null;
      const user = session?.user ?? null;
      setState({ session, user, loading: false, isAdmin: false });

      // refresh admin flag on auth change
      if (user?.id) {
        checkIsAdmin(user.id, user.email ?? null)
          .then((admin) => {
            if (!mounted) return;
            setState((s) => ({ ...s, isAdmin: !!admin }));
          })
          .catch((e) => console.error('[auth] admin check failed', e));
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return state;
}
