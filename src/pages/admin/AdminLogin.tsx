
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import GuestTopNavigation from '@/components/navigation/GuestTopNavigation';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { goToAdminDashboard } = useAppNavigation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already logged in
    const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isAdminAuth) {
      goToAdminDashboard();
    }
  }, [goToAdminDashboard]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would call an API endpoint to validate credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        // Set admin session in localStorage (in a real app, use proper JWT tokens or cookies)
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', username);
        
        // Set a session timestamp
        localStorage.setItem('admin_session_created', new Date().toISOString());
        
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin dashboard',
        });
        goToAdminDashboard();
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestTopNavigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <p>For demo purposes:</p>
                <p>Username: admin</p>
                <p>Password: password</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-material-primary hover:bg-material-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
