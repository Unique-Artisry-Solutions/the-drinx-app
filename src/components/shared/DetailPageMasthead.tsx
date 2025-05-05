
import React from 'react';

interface DetailPageMastheadProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const DetailPageMasthead: React.FC<DetailPageMastheadProps> = ({ 
  title, 
  subtitle, 
  imageUrl,
  children 
}) => {
  // Default fallback images that will be used if no custom image is provided
  const fallbackImages = [
    '/FireflyMasthead.jpg',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21'
  ];
  
  // Select a random fallback image if no image URL is provided
  const backgroundImage = imageUrl || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  return (
    <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl opacity-90 mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default DetailPageMasthead;
