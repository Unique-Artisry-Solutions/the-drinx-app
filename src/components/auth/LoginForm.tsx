
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment';
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
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    setShowResendVerification(false);
    
    try {
      if (isAdminLogin) {
        // Admin login logic
        if (email === 'admin@spiritless.com' && password === 'admin123') {
          localStorage.setItem('admin_authenticated', 'true');
          toast({
            title: 'Admin login successful',
            description: 'Welcome to the admin dashboard',
          });
          navigate('/admin/dashboard');
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        // Regular user login
        await signIn(email, password);
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to the explore page on successful login
          navigate('/explore');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Failed to login');
      
      // Show resend verification option if email not verified
      if (error.message.includes('Email not verified')) {
        setShowResendVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendVerification = async () => {
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link',
      });
    } catch (error: any) {
      setFormError(error.message || 'Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormError('');
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 pt-6">
        {isAdminLogin && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-4">
            <p className="text-sm text-amber-800">
              You are logging in as an administrator
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-xs text-spiritless-pink hover:text-spiritless-pink/90">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={toggleAdminLogin}
            className="text-xs text-spiritless-pink hover:text-spiritless-pink/90 p-0 h-auto"
          >
            {isAdminLogin ? 'Switch to user login' : 'Admin login'}
          </Button>
        </div>
        
        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}
        
        {showResendVerification && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800 mb-2">
              Your email is not yet verified. Please check your inbox for the verification link.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResendingEmail}
              className="flex items-center text-xs"
            >
              <Mail className="mr-1 h-3 w-3" />
              {isResendingEmail ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
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
      </CardFooter>
    </form>
  );
};

export default LoginForm;
