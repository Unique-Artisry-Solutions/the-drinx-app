
import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarCrawl {
  id: string;
  name: string;
  stops: number;
}

interface BarCrawlSectionProps {
  barCrawls: BarCrawl[];
  isAuthenticated: boolean;
}

const BarCrawlSection: React.FC<BarCrawlSectionProps> = ({ 
  barCrawls,
  isAuthenticated
}) => {
  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-spiritless-pink/10 to-spiritless-green/10 rounded-lg border border-spiritless-pink/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-spiritless-pink mb-2">Swig Circuits</h2>
          <p className="text-sm text-material-on-surface-variant">
            Discover or create spirit-free Swig Circuits in your area
          </p>
        </div>
        <div className="flex gap-3 mt-3 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-spiritless-green text-spiritless-green"
            asChild
          >
            <Link to="/map">
              <Map className="h-4 w-4" />
              <span>Find</span>
            </Link>
          </Button>
          {isAuthenticated && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2 bg-spiritless-pink text-white hover:bg-spiritless-pink/90"
              asChild
            >
              <Link to="/create-bar-crawl">
                <Route className="h-4 w-4" />
                <span>Create</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Sample Swig Circuit Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {barCrawls.slice(0, 3).map((crawl) => (
          <div key={crawl.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 text-lg">{crawl.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{crawl.stops} stops</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/bar-crawl/${crawl.id}`}>View</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarCrawlSection;
