
import React from 'react';
import AuthButton from '../AuthButton';

interface LoginFormActionsProps {
  isLoading: boolean;
  isSubmitting: boolean;
  isAdminLogin: boolean;
  userType: 'individual' | 'establishment';
  onClose?: () => void;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isLoading,
  isSubmitting,
  isAdminLogin,
  userType,
  onClose
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
    </div>
  );
};

export default LoginFormActions;
