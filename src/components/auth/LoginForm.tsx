
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { debouncedToast } from '@/utils/debouncedToast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface LoginFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onClose,
  userType = 'individual'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    console.log('Login attempt:', { email, userType });
    
    try {
      // Sign in with any valid credentials - don't restrict by userType
      const result = await signIn(email, password);
      
      if (result.error) {
        throw result.error;
      }
      
      debouncedToast.success(
        'Login Successful',
        'Welcome back!',
        { duration: 3000 }
      );
      
      // Only call onSuccess callback if provided (for modal use cases)
      if (onSuccess) {
        onSuccess();
      }
      
      // AuthProvider and LoginPage will handle navigation automatically
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      setFormError(errorMessage);
      
      debouncedToast.error(
        'Login Failed',
        errorMessage,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isLoading;

  const getButtonStyle = () => {
    switch (userType) {
      case 'admin':
        return 'bg-gray-800 hover:bg-gray-900 text-white';
      case 'promoter':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'establishment':
        return 'bg-spiritless-green hover:bg-spiritless-green/90 text-white';
      default:
        return 'bg-spiritless-pink hover:bg-spiritless-pink/90 text-white';
    }
  };

  const getButtonText = () => {
    if (isDisabled) return 'Signing in...';
    
    switch (userType) {
      case 'admin':
        return 'Sign In as Admin';
      case 'promoter':
        return 'Sign In as Promoter';
      case 'establishment':
        return 'Sign In as Business';
      default:
        return 'Sign In';
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="login-email">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isDisabled}
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="login-password">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isDisabled}
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}
        
        {isSubmitting && (
          <div className="text-blue-600 text-sm mt-2 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Signing in...
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <AuthButton
          type="submit"
          isLoading={isDisabled}
          disabled={isDisabled}
          className={`w-full ${getButtonStyle()}`}
        >
          {getButtonText()}
        </AuthButton>
        
        {onClose && (
          <AuthButton
            type="button"
            variant="outline"
            onClick={onClose}
            isLoading={false}
            disabled={isDisabled}
            className="w-full border-spiritless-orange text-spiritless-orange hover:bg-spiritless-orange/10"
          >
            Cancel
          </AuthButton>
        )}
      </CardFooter>
    </form>
  );
};

export default LoginForm;
