
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
        <div className="bg-muted/20 p-4 rounded-lg border mt-6">
          <h2 className="text-xl font-bold mb-2">Stay Connected</h2>
          <p>
            Follow your favorite promoters to receive updates about new events, promotions, and announcements.
          </p>
        </div>
      </div>
    </DesktopLayout>
  );
};

export default HomePage;
