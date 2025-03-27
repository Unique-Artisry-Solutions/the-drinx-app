
import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Benefits = () => {
  return (
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
  );
};

export default Benefits;
