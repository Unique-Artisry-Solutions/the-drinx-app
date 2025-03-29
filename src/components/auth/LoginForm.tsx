
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';

interface LoginFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem('user_authenticated', 'true');
      
      // Store either email or username based on what was used
      if (email) {
        localStorage.setItem('user_email', email);
      } else if (username) {
        localStorage.setItem('user_username', username);
      }
      
      // Set default user type if not already set (for existing users)
      if (!localStorage.getItem('user_type')) {
        localStorage.setItem('user_type', 'individual');
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      setIsLoading(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Always navigate to the index page after successful login
        navigate('/');
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email or Username
          </label>
          <Input
            id="email"
            type={email.includes('@') ? 'email' : 'text'}
            placeholder="Enter your email or username"
            value={email || username}
            onChange={(e) => {
              // Determine if input looks like an email or username
              if (e.target.value.includes('@')) {
                setEmail(e.target.value);
                setUsername('');
              } else {
                setUsername(e.target.value);
                setEmail('');
              }
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
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
          {isLoading ? 'Logging in...' : 'Login'}
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

export default LoginForm;
