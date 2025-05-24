
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { enhancedDebouncedToast } from '@/utils/enhancedDebouncedToast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';

interface LoginFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onClose,
  userType = 'individual'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signIn, isLoading, navigationReady } = useAuth();
  const { 
    setSigningIn, 
    shouldPreventInteraction, 
    getLoadingMessage,
    loadingStates 
  } = useAuthLoadingStates();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSigningIn(true);
    
    console.log('Login attempt:', { email, userType });
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        throw result.error;
      }
      
      enhancedDebouncedToast.authSuccess(
        'Login Successful',
        'Welcome back!',
        { duration: 3000 }
      );
      
      // Only call onSuccess callback if provided (for modal use cases)
      if (onSuccess) {
        onSuccess();
      }
      
      // AuthProvider will handle all navigation automatically
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      setFormError(errorMessage);
      
      enhancedDebouncedToast.authError(
        'Login Failed',
        errorMessage,
        { duration: 5000 }
      );
    } finally {
      setSigningIn(false);
    }
  };

  // Enhanced interaction prevention
  const canSubmit = navigationReady && !isLoading && !shouldPreventInteraction();
  const currentLoadingMessage = getLoadingMessage();

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
            disabled={shouldPreventInteraction()}
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
            disabled={shouldPreventInteraction()}
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}
        
        {currentLoadingMessage && (
          <div className="text-blue-600 text-sm mt-2 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            {currentLoadingMessage}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <AuthButton
          type="submit"
          isLoading={!canSubmit}
          disabled={!canSubmit}
          className={`w-full ${userType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : userType === 'promoter' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
        >
          {!canSubmit ? (currentLoadingMessage || 'Signing in...') : `Sign In${userType !== 'individual' ? ` as ${userType === 'establishment' ? 'Business' : 'Promoter'}` : ''}`}
        </AuthButton>
        
        {onClose && (
          <AuthButton
            type="button"
            variant="outline"
            onClick={onClose}
            isLoading={false}
            disabled={shouldPreventInteraction()}
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
