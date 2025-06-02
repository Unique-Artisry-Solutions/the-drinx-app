
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import UserTypeSelector from './UserTypeSelector';

interface UserAuthTabsProps {
  defaultTab?: 'login' | 'signup';
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

const UserAuthTabs: React.FC<UserAuthTabsProps> = ({ 
  defaultTab = 'login',
  userType: initialUserType = 'individual'
}) => {
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter'>(
    initialUserType === 'admin' ? 'individual' : initialUserType
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="signup">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose Account Type</CardTitle>
                <CardDescription>
                  Select the type of account you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTypeSelector
                  userType={userType}
                  onUserTypeChange={setUserType}
                />
              </CardContent>
            </Card>
            
            <SignupForm userType={userType} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAuthTabs;
