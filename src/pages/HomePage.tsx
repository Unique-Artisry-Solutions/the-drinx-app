
import React from 'react';
import DesktopLayout from '@/components/layout/DesktopLayout';

const HomePage: React.FC = () => {
  return (
    <DesktopLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to Swig</h1>
        <p className="text-lg mb-4">
          Discover non-alcoholic venues, events, and create your own drink recipes.
        </p>
      </div>
    </DesktopLayout>
  );
};

export default HomePage;
