import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const CallToAction = () => {
  return <div className="bg-spiritless-pink text-white py-20" role="complementary" aria-label="Call to action">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Discover Amazing Mocktails?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Create an account today and start finding the best non-alcoholic cocktails in your area. 
          Save your favorites, track your visits, and connect with a community of like-minded enthusiasts.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" variant="outline" aria-label="Create a free account" className="border-white text-brown hover:bg-white hover:text-spiritless-pink-dark focus:ring-2 focus:ring-white">
              Create Free Account
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" className="bg-[#590202] text-white hover:bg-[#3A0101] font-bold focus:ring-2 focus:ring-white" aria-label="View our pricing plans">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>;
};
export default CallToAction;