
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface UserAuthProps {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
}

const UserAuth: React.FC<UserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login'
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in or create an account to track your favorite mocktails
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onClose={onClose} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm onSuccess={onSuccess} onClose={onClose} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default UserAuth;
