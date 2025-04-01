
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Navigation, 
  Locate
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onToggleMapStyle: () => void;
  onRefreshLocation: () => void;
  isLoading: boolean;
  mapStyle: string;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleMapStyle,
  onRefreshLocation,
  isLoading,
  mapStyle,
}) => {
  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-md bg-white shadow-md"
            onClick={onZoomIn}
          >
            <ZoomIn size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Zoom in</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-md bg-white shadow-md"
            onClick={onZoomOut}
          >
            <ZoomOut size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Zoom out</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-md bg-white shadow-md"
            onClick={onToggleMapStyle}
          >
            <Layers size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Toggle map style</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-md bg-white shadow-md"
            onClick={onRecenter}
          >
            <Navigation size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Recenter map</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isLoading ? "secondary" : "outline"}
            size="icon" 
            className="h-8 w-8 rounded-md bg-white shadow-md"
            onClick={onRefreshLocation}
            disabled={isLoading}
          >
            <Locate size={16} className={isLoading ? "animate-pulse" : ""} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Refresh location</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MapControls;
