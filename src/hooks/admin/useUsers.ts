import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

export interface AdminUser {
  id: string;
  display_name: string | null;
  username: string | null;
  user_type: string | null;
  phone: string | null;
  created_at: string;
  bio: string | null;
  avatar_url: string | null;
}

interface UseUsersState {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    byRole: Record<string, number>;
  };
}

export const useUsers = () => {
  const { isAuthenticated, userType, isLoading: authLoading } = useAuthenticatedUser();
  
  const [state, setState] = useState<UseUsersState>({
    users: [],
    isLoading: true,
    error: null,
    stats: {
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
      byRole: {}
    }
  });

  const fetchUsers = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Early return if not authenticated or not admin
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      if (userType !== 'admin') {
        throw new Error('Access denied: Admin privileges required');
      }

      // Fetch all profiles with user auth data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Transform the data
      const users: AdminUser[] = profiles?.map(profile => ({
        id: profile.id,
        display_name: profile.display_name,
        username: profile.username,
        user_type: profile.user_type,
        phone: profile.phone,
        created_at: profile.created_at,
        bio: profile.bio,
        avatar_url: profile.avatar_url
      })) || [];

      // Calculate stats
      const stats = {
        total: users.length,
        active: users.filter(u => u.display_name || u.username).length, // Users with some identity
        pending: users.filter(u => !u.display_name && !u.username).length, // Users without identity
        suspended: 0, // We don't have suspension data in current schema
        byRole: users.reduce((acc, user) => {
          const role = user.user_type || 'individual';
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setState({
        users,
        isLoading: false,
        error: null,
        stats
      });

    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      toast.error(errorMessage);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Note: In a real app, you might want to soft delete or have more complex deletion logic
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    // Don't fetch if still loading auth or not authenticated
    if (!authLoading && isAuthenticated && userType === 'admin') {
      fetchUsers();
    } else if (!authLoading && (!isAuthenticated || userType !== 'admin')) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: !isAuthenticated ? 'Not authenticated' : 'Access denied: Admin privileges required'
      }));
    }
  }, [authLoading, isAuthenticated, userType]);

  return {
    ...state,
    refetch: fetchUsers,
    deleteUser
  };
};