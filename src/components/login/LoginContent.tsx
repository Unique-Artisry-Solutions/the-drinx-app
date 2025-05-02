
import React from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import LoginErrorMessage from './LoginErrorMessage';

interface LoginContentProps {
  requiredUserType: 'individual' | 'establishment' | 'promoter';
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
}

const LoginContent: React.FC<LoginContentProps> = ({ requiredUserType, errorMessage, setErrorMessage }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to your Spiritless account 
            {requiredUserType !== 'individual' ? ` as ${requiredUserType}` : ''}
          </p>
          
          <LoginErrorMessage 
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </div>
        
        <UserAuth 
          defaultTab="login" 
          userType={requiredUserType}
        />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-material-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
