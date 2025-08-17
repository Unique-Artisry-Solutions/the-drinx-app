
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, userType, authStable } = useAuthenticatedUser();
  
  // Always force light theme for landing page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);

  console.log('🏠 LandingPage render:', { isAuthenticated, userType, authStable });

  // Redirect authenticated users to their appropriate dashboard
  if (authStable && isAuthenticated && userType) {
    console.log('🔄 LandingPage: Redirecting authenticated user to dashboard');
    const dashboardPath = 
      userType === 'admin' ? '/admin/system-breakdown' :
      userType === 'establishment' ? '/establishment/dashboard' :
      userType === 'promoter' ? '/promoter/dashboard' : '/explore';
    
    return <Navigate to={dashboardPath} replace />;
  }

  // Show landing page for unauthenticated users or while auth is loading
  return (
    <Layout forceGuestNavigation={!isAuthenticated}>
      <div className="landing-page min-h-screen w-full">
        {/* Main content for landing page */}
        <main id="main-content" className="landing-main">
          {/* Hero Section with gradient background image */}
          <Hero />
          
          {/* Features Section */}
          <Features />
          
          {/* New Bold Key Features Section */}
          <KeyFeatures />
          
          {/* Benefits Section */}
          <Benefits />
          
          {/* CTA Section */}
          <CallToAction />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Layout>
  );
};

export default LandingPage;
