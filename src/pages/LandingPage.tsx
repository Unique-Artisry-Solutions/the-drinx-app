
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useAuth } from '@/contexts/auth';

const LandingPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to appropriate page
  React.useEffect(() => {
    if (user && !isLoading) {
      const userType = localStorage.getItem('user_type');
      if (userType === 'establishment') {
        navigate('/', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  // Only render the landing page if the user is not authenticated or if auth is still loading
  return (
    <Layout>
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
