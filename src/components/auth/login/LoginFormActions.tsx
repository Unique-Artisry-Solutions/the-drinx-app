
import React from 'react';
import { Button } from '@/components/ui/button';
import { isPreviewEnvironment } from '@/utils/environment';

interface LoginFormActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
  isAdminLogin: boolean;
  userType?: 'individual' | 'establishment' | 'promoter';
  onClose?: () => void;
  onBypassLogin?: (type: 'individual' | 'establishment' | 'promoter' | 'admin') => Promise<void>;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isSubmitting,
  isLoading,
  isAdminLogin,
  userType = 'individual',
  onClose,
  onBypassLogin
}) => {
  const showBypassButtons = isPreviewEnvironment() || process.env.NODE_ENV === 'development';

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
      
      {showBypassButtons && onBypassLogin && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Development Bypass Login</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onBypassLogin(isAdminLogin ? 'admin' : 'individual')}
            >
              {isAdminLogin ? 'Admin' : 'Individual'} Bypass
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onBypassLogin('establishment')}
            >
              Establishment Bypass
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs w-full col-span-2"
              onClick={() => onBypassLogin('promoter')}
            >
              Promoter Bypass
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginFormActions;
