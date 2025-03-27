
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="container mx-auto px-4 pt-12 pb-24">
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-medium text-material-on-background">
          Spirit<span className="text-material-primary">less</span>
        </h1>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Amazing Non-Alcoholic Cocktails Near You
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find local establishments with delicious spirit-free options. 
            Track your favorites, discover new flavors, and enjoy socializing without the alcohol.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/signup">
              <Button size="lg" className="mr-4">
                Get Started <ChevronRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="lg">
                Browse Mocktails
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="hidden md:block">
          <motion.img 
            src="/cocktail-hero.jpg" 
            alt="Colorful non-alcoholic cocktails" 
            className="rounded-lg shadow-xl w-full h-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
