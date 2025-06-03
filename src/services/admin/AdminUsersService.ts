
import { BaseAdminService } from './BaseAdminService';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  username?: string;
  display_name?: string;
  user_type: string;
  bio?: string;
  phone?: string;
  avatar_url?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export class AdminUsersService extends BaseAdminService<AdminUser> {
  constructor() {
    super('profiles');
  }

  async getUsersByType(userType: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', userType);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting users by type:', error);
      return [];
    }
  }

  async getUserStats() {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const { data: userTypes } = await supabase
        .from('profiles')
        .select('user_type')
        .not('user_type', 'is', null);

      const typeDistribution = (userTypes || []).reduce((acc, user) => {
        if (user.user_type) {
          acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        total: totalUsers || 0,
        active: activeUsers || 0,
        typeDistribution
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total: 0,
        active: 0,
        typeDistribution: {}
      };
    }
  }
}

export const usersService = new AdminUsersService();
