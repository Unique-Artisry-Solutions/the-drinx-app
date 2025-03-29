
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Wine, BookMarked, Share2 } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: <Map size={32} />,
      title: "Interactive Map",
      description: "Find spirit-free options near you with our interactive map featuring user ratings and reviews.",
      color: "spiritless-pink",
      delay: 0.1
    },
    {
      icon: <Wine size={32} />,
      title: "Cocktail Library",
      description: "Browse an extensive library of non-alcoholic cocktail recipes from top establishments.",
      color: "spiritless-green", 
      delay: 0.2
    },
    {
      icon: <BookMarked size={32} />,
      title: "Bar Crawl Planning",
      description: "Create and save spirit-free bar crawls to explore with friends on your next night out.",
      color: "spiritless-orange",
      delay: 0.3
    },
    {
      icon: <Share2 size={32} />,
      title: "Community Sharing",
      description: "Share your favorite spots and cocktails with friends and the Spiritless community.",
      color: "spiritless-burgundy",
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 px-4 bg-pattern-pink">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 border-b-4 border-spiritless-pink inline-block pb-2">
            Unlock These Amazing Features
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Once you sign up, you'll gain access to these powerful tools to enhance your alcohol-free experience.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`card-${feature.color.split('-')[1]} rounded-lg p-6 text-white shadow-bold-${feature.color.split('-')[1]} transition-transform hover:-translate-y-2`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
              <p className="text-white/90 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
