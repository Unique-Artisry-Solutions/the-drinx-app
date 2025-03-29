
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import Layout from '@/components/Layout';

const LandingPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section with gradient background image */}
        <main id="main-content">
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
