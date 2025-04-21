
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserAuthProps } from './types';

interface UserAuthHeaderProps extends Pick<UserAuthProps, 'defaultTab' | 'userType'> {}

const UserAuthHeader: React.FC<UserAuthHeaderProps> = ({ 
  defaultTab = 'login',
  userType = 'individual'
}) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl text-center">
        {defaultTab === 'signup' 
          ? (userType === 'establishment' ? 'Establishment Registration' : 
             userType === 'promoter' ? 'Promoter Registration' : 'Create Your Account')
          : 'Welcome Back'
        }
      </CardTitle>
      <CardDescription className="text-center">
        {defaultTab === 'signup' 
          ? (userType === 'establishment' 
              ? 'Register your business to showcase your mocktails'
              : userType === 'promoter'
                ? 'Register as a promoter to create swig circuits'
                : 'Sign up to discover and track your favorite mocktails')
          : 'Login to continue your mocktail journey'
        }
      </CardDescription>
    </CardHeader>
  );
};

export default UserAuthHeader;
