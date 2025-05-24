import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { debouncedToast } from '@/utils/debouncedToast';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import GuestTopNavigation from '@/components/navigation/GuestTopNavigation';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in as admin
    if (isAuthenticated && user && userType === 'admin') {
      navigate('/admin/system-breakdown');
    }
  }, [isAuthenticated, user, userType, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      // Note: userType will be set automatically by the auth context after role check
      debouncedToast.success(
        'Login successful',
        'Checking admin permissions...',
        3000
      );
      
      // The auth context will handle the redirect through userType
      
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      debouncedToast.error(
        'Login failed',
        error.message || 'Invalid credentials or insufficient permissions',
        5000
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-material-primary hover:bg-material-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
