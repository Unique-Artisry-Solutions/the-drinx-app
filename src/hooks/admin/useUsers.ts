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
  active_roles: string[];
  establishment_name: string | null;
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

      // Fetch users with roles and establishment info using the RPC function
      const { data: usersWithRoles, error: usersError } = await supabase
        .rpc('get_admin_users_with_roles')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Transform the data
      const users: AdminUser[] = usersWithRoles?.map(user => ({
        id: user.id,
        display_name: user.display_name,
        username: user.username,
        user_type: user.user_type,
        phone: user.phone,
        created_at: user.created_at,
        bio: user.bio,
        avatar_url: null, // RPC function doesn't return avatar_url
        active_roles: user.active_roles || [],
        establishment_name: user.establishment_name
      })) || [];

      // Calculate stats - need to handle unique users since establishment owners may appear multiple times
      const uniqueUsers = users.reduce((acc, user) => {
        if (!acc.find(u => u.id === user.id)) {
          acc.push(user);
        }
        return acc;
      }, [] as AdminUser[]);

      const stats = {
        total: uniqueUsers.length,
        active: uniqueUsers.filter(u => u.display_name || u.username).length, // Users with some identity
        pending: uniqueUsers.filter(u => !u.display_name && !u.username).length, // Users without identity
        suspended: 0, // We don't have suspension data in current schema
        byRole: uniqueUsers.reduce((acc, user) => {
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