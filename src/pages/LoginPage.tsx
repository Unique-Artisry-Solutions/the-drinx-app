
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft, Building, User, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { clearAllSessions } from '@/utils/adminBypass';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for login page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  const handleAuthSuccess = () => {
    // Force page refresh and navigation to index
    console.log("Login successful, forcing navigation to index");
    window.location.href = '/';
  };

  const handleClearSessions = () => {
    clearAllSessions();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-material-primary hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearSessions}
            className="flex items-center gap-1 text-gray-600"
          >
            <RefreshCw size={14} className="mr-1" />
            Clear All Sessions
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                Login to continue your journey with Spiritless
              </p>
            </div>
            
            <Card className="mb-6">
              <Tabs defaultValue="individual" onValueChange={(value) => setUserType(value as 'individual' | 'establishment')}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="individual" className="flex items-center justify-center">
                    <User size={16} className="mr-2" />
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value="establishment" className="flex items-center justify-center">
                    <Building size={16} className="mr-2" />
                    Establishment
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="individual">
                  <UserAuth defaultTab="login" onSuccess={handleAuthSuccess} userType="individual" />
                </TabsContent>
                
                <TabsContent value="establishment">
                  <UserAuth defaultTab="login" onSuccess={handleAuthSuccess} userType="establishment" />
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-material-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
