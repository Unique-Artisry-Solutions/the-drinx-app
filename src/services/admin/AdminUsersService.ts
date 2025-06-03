
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

export class AdminUsersService extends BaseAdminService<AdminUser> {
  constructor() {
    super('profiles');
  }

  async getUsersByType(userType: string) {
    // Mock implementation
    return [];
  }

  async getUserStats() {
    // Mock implementation
    return {
      total: 0,
      active: 0,
      typeDistribution: {}
    };
  }
}

export const usersService = new AdminUsersService();
