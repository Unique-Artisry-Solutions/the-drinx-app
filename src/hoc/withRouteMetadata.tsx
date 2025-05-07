
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { RouteMetadata } from '@/routes/config/routeConfig';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

interface WithRouteMetadataProps {
  metadata?: RouteMetadata;
  fallbackPath?: string;
}

export function withRouteMetadata<P extends object>(
  Component: React.ComponentType<P>,
  options: WithRouteMetadataProps = {}
) {
  const { metadata, fallbackPath = '/login' } = options;
  
  const EnhancedComponent: React.FC<P> = (props) => {
    const location = useLocation();
    const { user, isLoading } = useAuth();
    const { trackPage } = useAnalytics();
    
    useEffect(() => {
      // Track page view for analytics if a name is provided
      if (metadata?.analyticsName) {
        trackPage(metadata.analyticsName);
      } else {
        // Default to pathname if no specific analytics name is provided
        trackPage(location.pathname);
      }
    }, [location.pathname, metadata?.analyticsName, trackPage]);
    
    // Handle authentication requirements
    if (metadata?.requiresAuth && !isLoading) {
      if (!user) {
        // Save the current location for redirect after login
        localStorage.setItem('auth_redirect', location.pathname);
        
        // Show toast notification
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        
        // Redirect to login page
        return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
      }
      
      // Check for required user type if specified
      if (metadata.userType) {
        const userType = localStorage.getItem('user_type');
        const requiredTypes = Array.isArray(metadata.userType) ? metadata.userType : [metadata.userType];
        
        if (!userType || !requiredTypes.includes(userType as any)) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this page",
            variant: "destructive"
          });
          
          return <Navigate to="/" replace />;
        }
      }
    }
    
    // Render the component with page transition animation
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Component {...props} />
      </motion.div>
    );
  };
  
  // Set display name for debugging
  EnhancedComponent.displayName = `withRouteMetadata(${Component.displayName || Component.name || 'Component'})`;
  
  return EnhancedComponent;
}

export default withRouteMetadata;
