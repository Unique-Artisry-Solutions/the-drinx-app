
import React from 'react';
import { MapPin, Wine, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Features = () => {
  return (
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
  );
};

export default Features;
