
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import KeyFeatures from '@/components/landing/KeyFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { useCart } from '@/contexts/CartContext';
import CartButton from '@/components/cart/CartButton';

const LandingPage = () => {
  const { items } = useCart();
  const hasCartItems = items.length > 0;

  return (
    <div className="landing-page min-h-screen w-full">
      {/* Only show floating cart button if there are items in the cart */}
      {hasCartItems && (
        <div className="fixed top-4 right-4 z-50">
          <CartButton />
        </div>
      )}
      
      {/* Main content for landing page */}
      <main id="main-content" className="landing-main pt-20">
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
