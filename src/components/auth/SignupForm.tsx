
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthButton from './AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import SignupConfirmationModal from './SignupConfirmationModal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoading } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      // Add metadata for user profile
      const metadata = {
        name,
        username,
        user_type: userType
      };
      
      await signUp(email, password, metadata);
      
      // Show confirmation modal instead of redirecting
      setShowConfirmationModal(true);
      
      // Do NOT call onSuccess here, which could trigger redirection
    } catch (error: any) {
      console.error('Signup error:', error);
      setFormError(error.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    // Only call onSuccess after the user explicitly dismisses the modal, if needed
    if (onSuccess) {
      onSuccess();
    }
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
            <p className="text-xs text-muted-foreground">
              This is how you'll appear to others on the platform
            </p>
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
            <p className="text-xs text-muted-foreground">
              Must be unique, you'll use this to log in
            </p>
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
            isLoading={isLoading || isSubmitting}
            className={`w-full ${userType === 'individual' ? 'bg-spiritless-pink hover:bg-spiritless-pink/90' : 'bg-spiritless-green hover:bg-spiritless-green/90'} text-white`}
          >
            {isLoading || isSubmitting ? 'Creating account...' : `Create ${userType === 'establishment' ? 'Business' : 'Personal'} Account`}
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
