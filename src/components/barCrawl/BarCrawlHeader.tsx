
import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BarCrawlHeaderProps {
  barCrawl: {
    name: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    theme?: string;
    status?: string;
  };
}

const BarCrawlHeader: React.FC<BarCrawlHeaderProps> = ({ barCrawl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{barCrawl.name}</h1>
          {barCrawl.description && (
            <p className="text-gray-600 mb-4">{barCrawl.description}</p>
          )}
        </div>
        {barCrawl.status && (
          <Badge variant={barCrawl.status === 'active' ? 'default' : 'secondary'}>
            {barCrawl.status.charAt(0).toUpperCase() + barCrawl.status.slice(1)}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {barCrawl.date && (
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{barCrawl.date}</span>
          </div>
        )}
        
        {barCrawl.time && (
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{barCrawl.time}</span>
          </div>
        )}
        
        {barCrawl.location && (
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{barCrawl.location}</span>
          </div>
        )}
        
        {barCrawl.maxParticipants && (
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>{barCrawl.currentParticipants || 0}/{barCrawl.maxParticipants} participants</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarCrawlHeader;
