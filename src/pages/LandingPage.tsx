
import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position to determine when to show floating cart
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page min-h-screen w-full">
      {/* Only show floating cart button if there are items in the cart and user has scrolled */}
      {hasCartItems && isScrolled && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all">
            <CartButton />
          </div>
        </div>
      )}
      
      {/* Show header cart when user is at the top */}
      {hasCartItems && (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="landing-header bg-gradient-to-r from-spiritless-pink to-purple-700 text-white shadow-md py-2">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="landing-logo font-bold text-xl">
                Spirit<span className="font-light">less</span>
              </div>
              <CartButton />
            </div>
          </div>
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
