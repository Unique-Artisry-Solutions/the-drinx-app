
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useCart } from '@/contexts/CartContext';
import GuestTopNavigation from '@/components/navigation/GuestTopNavigation';

const LandingPage = () => {
  const { items } = useCart();
  const hasCartItems = items.length > 0;

  return (
    <div className="landing-page min-h-screen w-full">
      {/* Show navigation header when there are items in cart */}
      {hasCartItems && <GuestTopNavigation />}
      
      {/* Main content for landing page */}
      <main id="main-content" className={`landing-main ${hasCartItems ? 'pt-16' : ''}`}>
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
