
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarCrawlHeaderProps {
  name: string;
  organizer: string;
  date: string;
  stops: number;
  description?: string;
}

const BarCrawlHeader: React.FC<BarCrawlHeaderProps> = ({
  name,
  organizer,
  date,
  stops,
  description
}) => {
  const { toast } = useToast();

  const handleJoin = () => {
    toast({
      title: "Successfully joined!",
      description: "You've been added to this bar crawl"
    });
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <div className="flex flex-wrap gap-2 text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Organizer: {organizer}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Date: {date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{stops} stops</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleJoin}
          className="bg-spiritless-pink hover:bg-spiritless-pink/90 text-white"
        >
          Join Bar Crawl
        </Button>
      </div>
      
      {description && (
        <p className="text-gray-700 mb-3">{description}</p>
      )}
    </div>
  );
};

export default BarCrawlHeader;
