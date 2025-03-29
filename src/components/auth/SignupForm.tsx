
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment';
}

const SignupForm: React.FC<SignupFormProps> = ({ 
  onSuccess, 
  onClose, 
  userType = 'individual' 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoading } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Add metadata for user profile
      const metadata = {
        name,
        username,
        user_type: userType
      };
      
      await signUp(email, password, metadata);
      
      // Store user type in localStorage
      localStorage.setItem('user_type', userType);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Show success message and stay on the signup page
        // User needs to confirm email before being redirected
        toast({
          title: 'Check your email',
          description: 'Please check your email to confirm your account',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setFormError(error.message || 'Failed to sign up');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-email">
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-password">
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          />
        </div>
        
        {/* Conditional fields based on account type */}
        {userType === 'establishment' && (
          <div className="space-y-2 pt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
            <h3 className="text-sm font-medium text-spiritless-green">Establishment Details</h3>
            <p className="text-xs text-muted-foreground mb-2">
              You'll be able to add more details to your establishment profile after signing up.
            </p>
          </div>
        )}
        
        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <AuthButton
          type="submit"
          isLoading={isLoading}
          className={`w-full ${userType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
        >
          {isLoading ? 'Creating account...' : `Create ${userType === 'establishment' ? 'Business' : 'Personal'} Account`}
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

export default SignupForm;
