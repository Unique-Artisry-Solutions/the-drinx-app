
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, UsersRound, MapPin } from 'lucide-react';
import JoinBarCrawlButton from '../JoinBarCrawlButton';

interface BarCrawlProfileHeaderProps {
  name: string;
  participants: number;
  date: string;
  stops: number;
  id: string;
}

const BarCrawlProfileHeader: React.FC<BarCrawlProfileHeaderProps> = ({
  name,
  participants,
  date,
  stops,
  id
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="bg-material-surface p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{name}</h1>
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-material-on-surface-variant">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <UsersRound className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{participants} participants</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{stops} stops</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <JoinBarCrawlButton barCrawlId={id} />
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarCrawlProfileHeader;
