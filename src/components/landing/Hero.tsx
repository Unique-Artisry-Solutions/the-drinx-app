
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  return <div className="relative pt-12 pb-24 bg-gradient-to-b from-black/70 to-black/40" style={{
    backgroundImage: "url('/FireflyMasthead.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "overlay"
  }} role="banner" aria-label="Welcome to Myxxit - Find non-alcoholic cocktails near you">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-medium text-white">
            Myxxit
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              Discover Amazing Non-Alcoholic Cocktails Near You
            </motion.h2>
            <motion.p className="text-lg text-white mb-8" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              Find local establishments with delicious spirit-free options. 
              Track your favorites, discover new flavors, and enjoy socializing without the alcohol.
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-spiritless-pink hover:bg-spiritless-pink-dark text-white font-bold focus:ring-2 focus:ring-spiritless-pink-light" aria-label="Get started using Spiritless">
                  Get Started <ChevronRight className="ml-2" size={18} aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="text-white border-white bg-[#590202] hover:bg-[#3A0101] hover:text-white focus:ring-2 focus:ring-white" aria-label="View our pricing plans">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="hidden md:block">
            
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
