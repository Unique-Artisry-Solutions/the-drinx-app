
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page min-h-screen w-full">
      {/* Main content for landing page */}
      <main id="main-content" className="landing-main pt-16">
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
