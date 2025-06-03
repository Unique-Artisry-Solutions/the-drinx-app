
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { debouncedToast } from '@/utils/debouncedToast';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import GuestTopNavigation from '@/components/navigation/GuestTopNavigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Zap } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, userType, isAuthenticated, isLoading, navigationReady } = useAuth();
  const { isDevelopment, isDevModeActive, devMode, switchToUserType } = useDevelopmentMode();

  // Pre-fill credentials in development mode
  useEffect(() => {
    if (isDevelopment && !email && !password) {
      setEmail('admin@spiritless.com');
      setPassword('admin123');
      console.log('AdminLogin: Pre-filled admin credentials for development');
    }
  }, [isDevelopment, email, password]);

  useEffect(() => {
    // Check if user is already logged in as admin
    if (isAuthenticated && user && userType === 'admin') {
      console.log('AdminLogin - User already authenticated as admin, AuthProvider will handle redirect');
    }
  }, [isAuthenticated, user, userType]);

  const handleDevModeBypass = () => {
    console.log('AdminLogin: Activating dev mode admin bypass');
    switchToUserType('admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Admin login attempt for:', email);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      debouncedToast.success(
        'Login successful',
        'Checking admin permissions...',
        3000
      );
      
      // AuthProvider will handle userType determination and navigation automatically
      
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      let errorMessage = 'Invalid credentials or insufficient permissions';
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address before logging in.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // In development, provide additional help
      if (isDevelopment) {
        errorMessage += ' Try using the dev mode bypass or check if admin user was created properly.';
      }
      
      debouncedToast.error(
        'Login failed',
        errorMessage,
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation guard - prevent form submission during navigation loading
  const canSubmit = navigationReady && !isLoading && !isSubmitting;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestTopNavigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          {/* Development Mode Alert */}
          {isDevelopment && (
            <div className="px-6 pb-4">
              <Alert className="bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-orange-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Development mode detected</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDevModeBypass}
                      className="text-orange-600 border-orange-300 hover:bg-orange-100"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Dev Bypass
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-material-primary/30"
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
                  className="focus:ring-2 focus:ring-material-primary/30"
                  required
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Admin accounts must have the admin role assigned in the database.</p>
                {isDevelopment && (
                  <p className="text-orange-600 mt-1">
                    Development: Default credentials are admin@spiritless.com / admin123
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-material-primary hover:bg-material-primary/90 text-white"
                disabled={!canSubmit}
              >
                {!canSubmit ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
