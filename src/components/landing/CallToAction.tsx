
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <div className="bg-material-primary text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Discover Amazing Mocktails?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Create an account today and start finding the best non-alcoholic cocktails in your area. 
          Save your favorites, track your visits, and connect with a community of like-minded enthusiasts.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-material-primary">
              Create Free Account
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" className="bg-white text-material-primary hover:bg-white/90">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
