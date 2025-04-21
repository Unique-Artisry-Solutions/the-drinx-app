
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';

const SignupPage = () => {
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for signup page
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
              <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
              <p className="text-gray-600">
                Join Spiritless to discover amazing non-alcoholic cocktails near you
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
              defaultTab="signup" 
              userType={selectedUserType}
              // Remove the onSuccess prop which was triggering navigation
            />
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-material-primary hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
