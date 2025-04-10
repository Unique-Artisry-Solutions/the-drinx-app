
import React from 'react';
import AuthButton from '../AuthButton';
import { Button } from '@/components/ui/button';
import { Building, User, ShieldCheck, Megaphone } from 'lucide-react';

interface LoginFormActionsProps {
  isLoading: boolean;
  isSubmitting: boolean;
  isAdminLogin: boolean;
  userType: 'individual' | 'establishment';
  onClose?: () => void;
  onBypassLogin?: (type: 'individual' | 'establishment' | 'admin' | 'promoter') => void;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isLoading,
  isSubmitting,
  isAdminLogin,
  userType,
  onClose,
  onBypassLogin
}) => {
  return (
    <div className="flex flex-col gap-4">
      <AuthButton
        type="submit"
        isLoading={isLoading || isSubmitting}
        className={`w-full ${isAdminLogin ? 'bg-purple-600 hover:bg-purple-700' : userType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
      >
        {isLoading || isSubmitting ? 'Signing in...' : isAdminLogin ? 'Admin Login' : 'Login'}
      </AuthButton>
      
      {onClose && (
        <AuthButton
          type="button"
          variant="outline"
          onClick={onClose}
          isLoading={false}
          className="w-full border-spiritless-orange text-spiritless-orange hover:bg-spiritless-orange/10"
        >
          Cancel
        </AuthButton>
      )}

      {onBypassLogin && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-2 text-center">Admin Bypass (Testing Only)</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onBypassLogin('individual')}
              className="flex-1 flex items-center justify-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <User size={14} />
              User
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onBypassLogin('establishment')}
              className="flex-1 flex items-center justify-center gap-1 border-green-500 text-green-500 hover:bg-green-50"
            >
              <Building size={14} />
              Business
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onBypassLogin('admin')}
              className="flex-1 flex items-center justify-center gap-1 border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              <ShieldCheck size={14} />
              Admin
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onBypassLogin('promoter')}
              className="flex-1 flex items-center justify-center gap-1 border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <Megaphone size={14} />
              Promoter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginFormActions;
