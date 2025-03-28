
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background image */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* CTA Section */}
      <CallToAction />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
