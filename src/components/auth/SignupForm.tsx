import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { debouncedToast } from '@/utils/debouncedToast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/auth/AuthProvider';
import SignupConfirmationModal from './SignupConfirmationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';

interface SignupFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
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
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>(initialUserType);
  const [formError, setFormError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { signUp, isLoading, navigationReady } = useAuth();
  const { 
    setSigningUp, 
    shouldPreventInteraction, 
    getLoadingMessage,
    loadingStates 
  } = useAuthLoadingStates();

  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value as 'individual' | 'establishment' | 'promoter' | 'admin');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSigningUp(true);
    
    console.log('Signup attempt:', { 
      email, 
      username, 
      userType: selectedUserType 
    });
    
    try {
      const metadata = {
        name,
        username,
        user_type: selectedUserType
      };
      
      const redirectTo = `${window.location.origin}/?email_confirmed=true`;
      
      const result = await signUp({
        email,
        password,
        data: metadata,
        emailRedirectTo: redirectTo
      });
      
      if (result.error) {
        throw result.error;
      }
      
      if (email === 'jacksonmcfarland14@gmail.com') {
        await supabase.rpc('initialize_admin_roles');
        console.log('Admin roles initialized');
      }
      
      setShowConfirmationModal(true);
      
      debouncedToast.success(
        'Signup Successful',
        'Please check your email to verify your account.',
        { duration: 3000 }
      );
      
      // Only call onSuccess callback if provided (for modal use cases)
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up';
      setFormError(errorMessage);
      
      debouncedToast.error(
        'Signup Failed',
        errorMessage,
        { duration: 5000 }
      );
    } finally {
      setSigningUp(false);
    }
  };

  // Enhanced interaction prevention
  const canSubmit = navigationReady && !isLoading && !shouldPreventInteraction();
  const currentLoadingMessage = getLoadingMessage();

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
                <SelectItem value="admin">Admin Account</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the type of account you want to create
            </p>
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
            className={`w-full ${selectedUserType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : selectedUserType === 'promoter' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
          >
            {!canSubmit ? (currentLoadingMessage || 'Creating account...') : `Create ${selectedUserType === 'establishment' ? 'Business' : selectedUserType === 'promoter' ? 'Promoter' : 'Personal'} Account`}
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
              disabled={shouldPreventInteraction()}
              className="w-full border-spiritless-orange text-spiritless-orange hover:bg-spiritless-orange/10"
            >
              Cancel
            </AuthButton>
          )}
        </CardFooter>
      </form>

      <SignupConfirmationModal 
        isOpen={showConfirmationModal} 
        onClose={() => setShowConfirmationModal(false)}
        email={email}
      />
    </>
  );
};

export default SignupForm;
