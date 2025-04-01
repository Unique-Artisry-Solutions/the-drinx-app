
import React from 'react';
import { Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapErrorProps {
  mapError: string;
  tokenInput: string;
  setTokenInput: (token: string) => void;
  handleSaveToken: () => void;
}

const MapError: React.FC<MapErrorProps> = ({
  mapError,
  tokenInput,
  setTokenInput,
  handleSaveToken
}) => {
  return (
    <div className="mt-4 max-w-md mx-auto">
      <p className="text-red-500 mb-2">{mapError}</p>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Enter your Mapbox token below. You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a> dashboard.
        </p>
        <Input
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Enter Mapbox token..."
          className="bg-white"
        />
        <Button onClick={handleSaveToken} className="w-full">
          Save Token
        </Button>
      </div>
    </div>
  );
};

export default MapError;
