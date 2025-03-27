
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Wine, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
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

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Spiritless?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin size={28} />}
              title="Find Near You"
              description="Discover establishments with non-alcoholic options close to your location."
            />
            <FeatureCard 
              icon={<Wine size={28} />}
              title="Unique Flavors"
              description="Explore creative and delicious alcohol-free cocktails with detailed recipes."
            />
            <FeatureCard 
              icon={<Users size={28} />}
              title="Community"
              description="Connect with other mocktail enthusiasts and share your favorite spots."
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Benefits of Going Spirit-Free</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              title="Better Sleep"
              description="Enjoy improved sleep quality without alcohol affecting your rest."
            />
            <BenefitCard
              title="No Hangovers"
              description="Wake up refreshed and ready for the day with no morning-after effects."
            />
            <BenefitCard
              title="Socialize Freely"
              description="Participate in social gatherings without the pressure to drink alcohol."
            />
            <BenefitCard
              title="Discover New Tastes"
              description="Explore complex flavors that aren't masked by alcohol."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-material-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Amazing Mocktails?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Create an account today and start finding the best non-alcoholic cocktails in your area. 
            Save your favorites, track your visits, and connect with a community of like-minded enthusiasts.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-material-primary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-medium mb-4">
                Spirit<span className="text-material-primary">less</span>
              </h3>
              <p className="text-gray-400 max-w-xs">
                The premier platform for discovering and sharing non-alcoholic cocktail experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">About</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Our Mission</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Team</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Recipes</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm text-center">
            <p>© {new Date().getFullYear()} Spiritless. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center"
      whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-material-primary/10 p-4 rounded-full mb-5 text-material-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Benefit Card Component
const BenefitCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Star size={18} className="text-yellow-500 mr-2" />
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
