
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { Form, FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface SignupFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment';
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onClose, userType = 'individual' }) => {
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
      localStorage.setItem('user_type', userType);
      
      toast({
        title: 'Account created',
        description: 'Welcome to Spiritless!',
      });
      setIsLoading(false);
      
      // Call onSuccess if provided, otherwise navigate to appropriate homepage
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the appropriate profile page based on user type
        if (userType === 'establishment') {
          navigate('/establishment/profile');
        } else {
          navigate('/');
        }
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
