import { supabase } from '@/lib/supabase';
import { SwitchableUserRole, isSwitchableRole } from '@/types/userRole';

export interface RoleVerificationResult {
  canSwitch: boolean;
  availableRoles: string[];
  reason?: string;
}

export class RoleVerificationService {
  /**
   * Verify if user can switch to the target role
   */
  static async verifyRoleSwitch(userId: string, targetRole: SwitchableUserRole): Promise<RoleVerificationResult> {
    try {
      // Check if target role is switchable
      if (!isSwitchableRole(targetRole)) {
        return {
          canSwitch: false,
          availableRoles: [],
          reason: `Role "${targetRole}" is not switchable`
        };
      }

      // Get user's available roles from database
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Role verification error:', error);
        return {
          canSwitch: false,
          availableRoles: [],
          reason: 'Failed to fetch user roles'
        };
      }

      const availableRoles = userRoles?.map(r => r.role) || [];
      const hasTargetRole = availableRoles.includes(targetRole);

      return {
        canSwitch: hasTargetRole,
        availableRoles,
        reason: hasTargetRole ? undefined : `User does not have "${targetRole}" role`
      };
    } catch (error) {
      console.error('Role verification service error:', error);
      return {
        canSwitch: false,
        availableRoles: [],
        reason: 'Role verification failed'
      };
    }
  }

  /**
   * Get all available roles for a user
   */
  static async getUserAvailableRoles(userId: string): Promise<string[]> {
    try {
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to fetch user roles:', error);
        return [];
      }

      return userRoles?.map(r => r.role) || [];
    } catch (error) {
      console.error('Get user roles error:', error);
      return [];
    }
  }

  /**
   * Check if user currently has a specific role active
   */
  static async checkActiveRole(userId: string): Promise<string | null> {
    try {
      const { data: activeRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Failed to check active role:', error);
        return null;
      }

      return activeRole?.role || null;
    } catch (error) {
      console.error('Check active role error:', error);
      return null;
    }
  }
}