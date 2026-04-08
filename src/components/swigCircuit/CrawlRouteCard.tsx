
import React from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
}

interface CrawlRouteCardProps {
  establishments: Establishment[];
}

const CrawlRouteCard: React.FC<CrawlRouteCardProps> = ({ establishments }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <Route className="h-5 w-5 mr-2 text-spiritless-pink" />
        Crawl Route
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
        {establishments.map((establishment, index) => (
          <Link 
            key={establishment.id} 
            to={`/establishment/${establishment.id}`} 
            className="flex items-center py-1 hover:text-spiritless-pink transition-colors"
          >
            <div className="flex items-center justify-center bg-spiritless-pink text-white rounded-full h-6 w-6 text-sm mr-2 flex-shrink-0">
              {index + 1}
            </div>
            <span className="text-material-primary hover:underline truncate">
              {establishment.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CrawlRouteCard;
