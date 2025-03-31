
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, ExternalLink } from 'lucide-react';

interface SignupConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const SignupConfirmationModal: React.FC<SignupConfirmationModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-spiritless-pink" />
            Verify your email
          </DialogTitle>
          <DialogDescription>
            We've sent a verification link to <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm">
            Please check your inbox and click the verification link to activate your account.
          </p>
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800 mb-2">
              <strong>For development testing:</strong> You can disable email verification in Supabase.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center text-xs"
              asChild
            >
              <a 
                href="https://supabase.com/dashboard/project/dvifibvzwunnpcsihpxq/auth/providers" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Configure Auth Settings
              </a>
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupConfirmationModal;
