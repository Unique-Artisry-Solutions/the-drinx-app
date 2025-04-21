
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth'; // Fixed import path

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    if (user) {
      const userType = localStorage.getItem('user_type');
      console.log("NotFound page - redirecting user type:", userType);
      
      if (userType === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (userType === 'promoter') {
        navigate('/promoter/dashboard');
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/landing');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-primary animate-float">404</h1>
        <p className="text-xl text-foreground mb-6">
          We couldn't find the page you're looking for
        </p>
        <p className="text-muted-foreground mb-8">
          The page you requested doesn't exist or may have been moved.
        </p>
        <button 
          onClick={handleGoHome}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full inline-block font-medium transition-all hover:bg-opacity-90 hover:shadow-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
