
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-purple-500 animate-float">404</h1>
        <p className="text-xl text-white mb-6">
          We couldn't find the page you're looking for
        </p>
        <p className="text-gray-400 mb-8">
          The page you requested doesn't exist or may have been moved.
        </p>
        <Link 
          to="/" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full inline-block font-medium transition-all hover:bg-opacity-90 hover:shadow-lg"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
