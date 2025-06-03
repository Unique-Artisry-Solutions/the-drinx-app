
import { BaseAdminService } from './BaseAdminService';

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

/**
 * @deprecated Use SimplifiedAdminService instead
 * This service will be removed in a future version
 */
export class AdminUsersService extends BaseAdminService<AdminUser> {
  constructor() {
    super('profiles');
    console.warn('AdminUsersService is deprecated. Use SimplifiedAdminService instead.');
  }

  async getUsersByType(userType: string) {
    return [];
  }

  async getUserStats() {
    return {
      total: 0,
      active: 0,
      typeDistribution: {}
    };
  }
}

export const usersService = new AdminUsersService();
