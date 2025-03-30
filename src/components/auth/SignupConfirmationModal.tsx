
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface SignupConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const SignupConfirmationModal: React.FC<SignupConfirmationModalProps> = ({ isOpen, onClose, email }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to the Community!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for joining Spiritless
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="bg-spiritless-pink/10 p-3 rounded-full mb-4">
            <Mail className="h-10 w-10 text-spiritless-pink" />
          </div>
          <p className="text-center mb-2">
            We've sent a verification link to:
          </p>
          <p className="font-medium text-center mb-4">
            {email}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Please check your inbox and click the verification link to activate your account.
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            onClick={onClose} 
            className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupConfirmationModal;
