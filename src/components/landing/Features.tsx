
import React from 'react';
import { MapPin, Wine, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#590202]">Why Choose Spiritless?</h2>
        
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
