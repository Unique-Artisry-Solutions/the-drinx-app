
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
    <section 
      style={{
        backgroundImage: "url('/featuresBG.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} 
      role="region" 
      aria-labelledby="features-heading" 
      className="py-20 px-4 bg-[#ffc99e]"
    >
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12" 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
        >
          <h2 
            id="features-heading" 
            className="text-3xl font-bold mb-4 border-b-4 border-spiritless-pink inline-block pb-2 text-[#590202]"
          >
            Unlock These Amazing Features
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[#590202]">
            Once you sign up, you'll gain access to these powerful tools to enhance your alcohol-free experience.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: feature.delay }} 
              role="article" 
              aria-labelledby={`feature-heading-${index}`} 
              className=""
            >
              <div 
                className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto" 
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 
                id={`feature-heading-${index}`} 
                className="text-xl font-bold mb-3 text-center"
              >
                {feature.title}
              </h3>
              <p className="text-center text-orange-950">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
