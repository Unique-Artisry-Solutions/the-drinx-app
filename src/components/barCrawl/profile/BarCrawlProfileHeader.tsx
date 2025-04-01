
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleShareBarCrawl = () => {
    toast({
      title: "Bar Crawl Shared",
      description: "Invitation link copied to clipboard"
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex flex-wrap gap-2 text-gray-600 mt-1">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{stops} stops</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShareBarCrawl}
        >
          Invite Friends
        </Button>
        <Button 
          size="sm"
          asChild
        >
          <Link to={`/profile/bar-crawls/participants/${id}`}>
            View Participants
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BarCrawlProfileHeader;
