
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
    <div className="min-h-screen flex items-center justify-center bg-material-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-material-primary animate-float">404</h1>
        <p className="text-xl text-material-on-surface mb-6">
          We couldn't find the page you're looking for
        </p>
        <p className="text-material-on-surface-variant mb-8">
          The page you requested doesn't exist or may have been moved.
        </p>
        <Link 
          to="/" 
          className="bg-material-primary text-material-on-primary px-6 py-3 rounded-full inline-block font-medium transition-all hover:bg-opacity-90"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
