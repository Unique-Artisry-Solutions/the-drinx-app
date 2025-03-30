
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import VerificationStatus from './VerificationStatus';
import VerificationActions from './VerificationActions';

const EmailVerificationContainer: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleResendVerification = async () => {
    if (!user || !user.email) {
      toast({
        title: 'Error',
        description: 'Unable to determine your email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };
  
  const handleCheckVerification = async () => {
    await refreshSession();
    toast({
      title: 'Verification status checked',
      description: 'If you have verified your email, you will be redirected',
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl font-semibold">Email Verification Required</CardTitle>
        <CardDescription>
          Please verify your email address to continue
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        <VerificationStatus email={user?.email} />
        <VerificationActions 
          isResending={isResending}
          onResendVerification={handleResendVerification}
          onCheckVerification={handleCheckVerification}
          isMobile={isMobile}
        />
      </CardContent>
    </Card>
  );
};

export default EmailVerificationContainer;
