
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { isPreviewEnvironment } from '@/utils/environment';

const LandingPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for landing page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  // If user is already authenticated, redirect to appropriate page
  useEffect(() => {
    // Only redirect if we're not in a loading state and have a valid user
    if (!isLoading && user) {
      console.log('User is authenticated, redirecting from landing page');
      const userType = localStorage.getItem('user_type');
      const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
      
      if (isAdmin) {
        navigate('/admin/system-breakdown', { replace: true });
      } else if (userType === 'establishment') {
        navigate('/establishment/dashboard', { replace: true });
      } else if (userType === 'promoter') {
        navigate('/promotions', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  // Clear sessions when landing page loads, but not in preview environment
  useEffect(() => {
    // Skip in preview environment
    if (isPreviewEnvironment()) {
      console.log('Preview environment detected: skipping session cleanup');
      return;
    }
    
    // Run once on initial load
    console.log('Landing page loaded, clearing sessions...');
    clearAllSessions();
  }, []);

  // Only render the landing page if the user is not authenticated or if auth is still loading
  return (
    <Layout forceGuestNavigation={true}>
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
