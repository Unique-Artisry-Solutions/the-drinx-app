
import React from 'react';

const MapPageLoading = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MapPageLoading;
