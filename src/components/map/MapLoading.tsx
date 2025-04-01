
import React from 'react';
import { Map } from 'lucide-react';
import MapError from './MapError';

interface MapLoadingProps {
  mapError: string | null;
  tokenInput: string;
  setTokenInput: (token: string) => void;
  handleSaveToken: () => void;
}

const MapLoading: React.FC<MapLoadingProps> = ({
  mapError,
  tokenInput,
  setTokenInput,
  handleSaveToken
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Map className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
        <p className="mt-2 text-gray-500">Loading map...</p>
        
        {mapError && (
          <MapError 
            mapError={mapError} 
            tokenInput={tokenInput}
            setTokenInput={setTokenInput}
            handleSaveToken={handleSaveToken}
          />
        )}
      </div>
    </div>
  );
};

export default MapLoading;
