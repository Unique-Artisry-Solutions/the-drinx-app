
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Map, X, Check } from 'lucide-react';

interface BarCrawl {
  id: string;
  name: string;
  date: string;
  participants: number;
  organizer: string;
  startDate: string;
  endDate: string;
  status: 'accepted' | 'pending';
  otherEstablishments: string[];
}

interface BarCrawlCardProps {
  crawl: BarCrawl;
  handleEndParticipation: (id: string) => void;
  handleAcceptRequest?: (id: string) => void;
}

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({
  crawl,
  handleEndParticipation,
  handleAcceptRequest
}) => {
  const isPending = crawl.status === 'pending';
  
  if (isPending) {
    return (
      <div className="border-2 border-orange-300 rounded-md p-4 bg-orange-50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="font-medium">{crawl.name}</h3>
          </div>
          <div className="bg-orange-200 text-orange-800 px-3 py-1 rounded">
            Pending Request
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">
              <span className="font-medium">Starts:</span> {new Date(crawl.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">
              <span className="font-medium">Ends:</span> {new Date(crawl.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-1">Organizer</h4>
          <div className="flex items-center bg-white p-2 rounded mb-3">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">{crawl.organizer}</span>
          </div>
          
          <h4 className="text-sm font-medium mb-1">Other Participating Establishments</h4>
          <div className="bg-white p-2 rounded">
            {crawl.otherEstablishments.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {crawl.otherEstablishments.map((est, index) => (
                  <li key={index}>{est}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No other establishments yet</p>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEndParticipation(crawl.id)}
            className="mr-2"
          >
            <X className="h-4 w-4 mr-1" /> Decline
          </Button>
          {handleAcceptRequest && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleAcceptRequest(crawl.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" /> Accept Request
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-material-primary mr-2" />
          <h3 className="font-medium">{crawl.name}</h3>
        </div>
        <div className="bg-material-primary/10 px-3 py-1 rounded text-material-primary">
          {new Date(crawl.date).toLocaleDateString()}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm">{crawl.participants} participants</span>
        </div>
        <div className="flex items-center">
          <Map className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm">Organizer: {crawl.organizer}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm">
            <span className="font-medium">Starts:</span> {new Date(crawl.startDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm">
            <span className="font-medium">Ends:</span> {new Date(crawl.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex justify-end">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => handleEndParticipation(crawl.id)}
        >
          <X className="h-4 w-4 mr-1" /> End Participation
        </Button>
      </div>
    </div>
  );
};

export default BarCrawlCard;
