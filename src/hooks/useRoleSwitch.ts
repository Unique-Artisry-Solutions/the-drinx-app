
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'individual' | 'establishment' | 'promoter';

export function useRoleSwitch() {
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('individual');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .order('created_at');

      if (error) throw error;

      const userRoles = roles.map(r => r.role as UserRole);
      setAvailableRoles(userRoles);
      
      const activeRole = roles.find(r => r.is_active)?.role as UserRole;
      if (activeRole) {
        setCurrentRole(activeRole);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc('switch_active_role', {
        role_to_activate: newRole
      });

      if (error) throw error;

      setCurrentRole(newRole);
      
      // Store the current role in localStorage
      localStorage.setItem('user_type', newRole);
      
      // Show success message
      toast({
        title: "Role Changed",
        description: `Switched to ${newRole} account`,
      });

      // Redirect based on new role
      if (newRole === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (newRole === 'promoter') {
        navigate('/promoter/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (error: any) {
      console.error('Error switching role:', error);
      toast({
        title: "Error",
        description: error.message || "Could not switch roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availableRoles,
    currentRole,
    isLoading,
    switchRole
  };
}
