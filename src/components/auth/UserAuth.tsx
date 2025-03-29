
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface UserAuthProps {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment';
}

const UserAuth: React.FC<UserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual'
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {defaultTab === 'signup' 
            ? (userType === 'establishment' ? 'Establishment Registration' : 'Create Your Account')
            : 'Welcome Back'
          }
        </CardTitle>
        <CardDescription className="text-center">
          {defaultTab === 'signup' 
            ? (userType === 'establishment' 
              ? 'Register your business to showcase your mocktails'
              : 'Sign up to discover and track your favorite mocktails')
            : 'Login to continue your mocktail journey'
          }
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onClose={onClose} onSuccess={onSuccess} userType={userType} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm onSuccess={onSuccess} onClose={onClose} userType={userType} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default UserAuth;
