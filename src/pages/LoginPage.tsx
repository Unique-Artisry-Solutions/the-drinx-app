
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';

const LoginPage = () => {
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for login page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-material-primary hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                Sign in to your Spiritless account
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-t-lg shadow-sm">
              <Tabs 
                value={selectedUserType} 
                onValueChange={(value) => setSelectedUserType(value as 'individual' | 'establishment' | 'promoter')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger 
                    value="individual"
                    className="data-[state=active]:bg-spiritless-pink data-[state=active]:text-white"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger 
                    value="establishment"
                    className="data-[state=active]:bg-spiritless-green data-[state=active]:text-white"
                  >
                    Business
                  </TabsTrigger>
                  <TabsTrigger 
                    value="promoter"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Promoter
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <UserAuth 
              defaultTab="login" 
              userType={selectedUserType}
            />
            
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
