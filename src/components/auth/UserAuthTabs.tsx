
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { UserAuthProps } from './types';
import { BaseComponentProps, StandardNavigationProps } from '@/components/shared/types';

// Extend with standard props
interface StandardUserAuthTabsProps extends UserAuthProps, BaseComponentProps {}

const UserAuthTabs: React.FC<StandardUserAuthTabsProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual',
  className,
  'data-testid': testId
}) => {
  return (
    <Tabs 
      defaultValue={defaultTab} 
      className={`w-full ${className || ''}`}
      data-testid={testId}
    >
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
  );
};

export default UserAuthTabs;
