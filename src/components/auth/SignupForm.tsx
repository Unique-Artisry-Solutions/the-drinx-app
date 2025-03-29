
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'establishment'>(userType);
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
      localStorage.setItem('user_type', selectedUserType);
      
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
        if (selectedUserType === 'establishment') {
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
        
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium block mb-2">
            Account Type
          </label>
          <RadioGroup 
            defaultValue={userType} 
            value={selectedUserType}
            onValueChange={(value) => setSelectedUserType(value as 'individual' | 'establishment')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="establishment" id="establishment" />
              <Label htmlFor="establishment">Establishment / Business</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedUserType === 'individual' 
              ? 'Create an account to discover and save mocktails' 
              : 'Register your business to manage your mocktail offerings'}
          </p>
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
