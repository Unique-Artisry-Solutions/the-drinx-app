
import React from 'react';
import { Button } from '@/components/ui/button';
import DevBypass from '@/components/development/DevBypass';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import type { TestUserType } from '@/contexts/DevelopmentModeContext';

interface LoginFormActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
  isAdminLogin: boolean;
  userType?: TestUserType;
  onClose?: () => void;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isSubmitting,
  isLoading,
  isAdminLogin,
  userType = 'individual',
  onClose
}) => {
  const { isDevelopment } = useDevelopmentMode();

  // Determine which user types to show based on context
  const getContextualUserTypes = (): TestUserType[] => {
    if (isAdminLogin) return ['admin'];
    if (userType) return [userType, 'establishment', 'promoter'];
    return ['individual', 'establishment', 'promoter'];
  };

  return (
    <div className="w-full space-y-4">
      <Button
        type="submit"
        className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
      
      {onClose && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
      
      {isDevelopment && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Development Bypass Login</p>
          <DevBypass 
            variant="inline"
            showOnlyUserTypes={getContextualUserTypes()}
            showLogoutButton={false}
          />
        </div>
      )}
    </div>
  );
};

export default LoginFormActions;
