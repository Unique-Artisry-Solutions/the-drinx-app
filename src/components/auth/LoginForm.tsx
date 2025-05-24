
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { debouncedToast } from '@/utils/debouncedToast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/auth/AuthProvider';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      console.log('Login attempt:', { email, userType });
      
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      debouncedToast.success(
        'Login Successful',
        'Welcome back!',
        3000
      );
      
      // Only call onSuccess callback if provided (for modal use cases)
      if (onSuccess) {
        onSuccess();
      }
      
      // AuthProvider will handle all navigation automatically
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Failed to sign in';
      setFormError(errorMessage);
      
      debouncedToast.error(
        'Login Failed',
        errorMessage,
        5000
      );
    } finally {
      setIsSubmitting(false);
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
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <AuthButton
          type="submit"
          isLoading={isLoading || isSubmitting}
          className={`w-full ${userType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : userType === 'promoter' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
        >
          {isLoading || isSubmitting ? 'Signing in...' : `Sign In${userType !== 'individual' ? ` as ${userType === 'establishment' ? 'Business' : 'Promoter'}` : ''}`}
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
      </CardFooter>
    </form>
  );
};

export default LoginForm;
