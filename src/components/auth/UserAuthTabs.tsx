
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import TestCredentials from './TestCredentials';
import { UserAuthProps } from './types';

const UserAuthTabs: React.FC<UserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual'
}) => {
  return (
    <>
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
      
      <TestCredentials />
    </>
  );
};

export default UserAuthTabs;
