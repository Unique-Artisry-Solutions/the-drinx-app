
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import SignupConfirmationModal from './SignupConfirmationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface SignupFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const SignupForm: React.FC<SignupFormProps> = ({ 
  onSuccess, 
  onClose,
  userType: initialUserType = 'individual'
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'establishment' | 'promoter'>(initialUserType);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoading } = useAuth();

  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value as 'individual' | 'establishment' | 'promoter');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      const metadata = {
        name,
        username,
        user_type: selectedUserType
      };
      
      const redirectTo = `${window.location.origin}/?email_confirmed=true`;
      
      await signUp(email, password, {
        data: metadata,
        emailRedirectTo: redirectTo
      });
      
      if (email === 'jacksonmcfarland14@gmail.com') {
        await supabase.rpc('initialize_admin_roles');
      }
      
      setShowConfirmationModal(true);
      
      // Optional: Show success toast
      toast({
        title: 'Signup Successful',
        description: 'Please check your email to verify your account.',
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // More specific error handling
      const errorMessage = error.message || 'Failed to sign up';
      setFormError(errorMessage);
      
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Display Name
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

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="user-type">
              Account Type
            </label>
            <Select value={selectedUserType} onValueChange={handleUserTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Personal Account</SelectItem>
                <SelectItem value="promoter">Promoter Account</SelectItem>
                <SelectItem value="establishment">Business Account</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the type of account you want to create
            </p>
          </div>
          
          {formError && (
            <div className="text-red-500 text-sm mt-2">{formError}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <AuthButton
            type="submit"
            isLoading={isLoading || isSubmitting}
            className={`w-full ${selectedUserType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : selectedUserType === 'promoter' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
          >
            {isLoading || isSubmitting ? 'Creating account...' : `Create ${selectedUserType === 'establishment' ? 'Business' : selectedUserType === 'promoter' ? 'Promoter' : 'Personal'} Account`}
          </AuthButton>
          
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you'll receive a verification email to confirm your account
          </p>
          
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

      <SignupConfirmationModal 
        isOpen={showConfirmationModal} 
        onClose={handleConfirmationClose}
        email={email}
      />
    </>
  );
};

export default SignupForm;
