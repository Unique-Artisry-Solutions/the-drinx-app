
import React, { useEffect } from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useTheme } from '@/contexts/ThemeContext';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for landing page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Pure landing page - no authentication redirects
  return (
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
  );
};

export default LandingPage;
