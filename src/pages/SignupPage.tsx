
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignupPage = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    // Redirect to the main app after successful authentication
    navigate('/');
  };
  
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
            
            <UserAuth onSuccess={handleAuthSuccess} defaultTab="signup" />
            
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
