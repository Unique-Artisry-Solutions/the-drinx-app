
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const VerifyEmail = () => {
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
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh] px-3 sm:px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-semibold">Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 text-sm sm:text-base">Verification needed</h3>
                  <p className="text-xs sm:text-sm text-amber-700 mt-1">
                    We've sent a verification email to <strong>{user?.email}</strong>. 
                    Please check your inbox and click the verification link.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center space-x-2 text-sm"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  size={isMobile ? "sm" : "default"}
                >
                  <Mail className="h-4 w-4" />
                  <span>{isResending ? 'Sending...' : 'Resend verification email'}</span>
                </Button>
                
                <Button
                  variant="default"
                  className="flex items-center justify-center space-x-2 bg-spiritless-pink hover:bg-spiritless-pink/90 text-sm"
                  onClick={handleCheckVerification}
                  size={isMobile ? "sm" : "default"}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>I've verified my email</span>
                </Button>
              </div>
              
              <div className="text-center pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
                <Link to="/logout" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                  Sign out and use a different account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
