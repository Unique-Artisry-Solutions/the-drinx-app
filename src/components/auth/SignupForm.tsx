
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';

interface SignupFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      // Mock successful signup
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_username', username);
      toast({
        title: 'Account created',
        description: 'Welcome to Spiritless!',
      });
      setIsLoading(false);
      
      // Call onSuccess if provided, otherwise navigate to homepage
      if (onSuccess) {
        onSuccess();
      } else {
        // Always navigate to the homepage after successful signup
        navigate('/');
      }
    }, 1000);
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
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <AuthButton
          type="submit"
          isLoading={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </AuthButton>
        {onClose && (
          <AuthButton
            type="button"
            variant="outline"
            onClick={onClose}
            isLoading={false}
          >
            Cancel
          </AuthButton>
        )}
      </CardFooter>
    </form>
  );
};

export default SignupForm;
