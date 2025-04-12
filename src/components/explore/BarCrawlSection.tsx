
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
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  // Check if user is a promoter to show the Create button
  const userType = localStorage.getItem('user_type');
  const isPromoter = userType === 'promoter';
  
  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-spiritless-pink/20 to-spiritless-green/20 rounded-lg border border-spiritless-pink/30 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-spiritless-pink mb-2">Swig Circuits</h2>
          <p className="text-sm text-muted-foreground">
            Discover spirit-free Swig Circuits in your area
            {isPromoter && " or create your own"}
          </p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 border-spiritless-green text-spiritless-green flex-1 sm:flex-none"
            asChild
          >
            <Link to="/map" onClick={scrollToTop}>
              <Map className="h-4 w-4" />
              <span>Find</span>
            </Link>
          </Button>
          {isAuthenticated && isPromoter && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1 bg-spiritless-pink text-white hover:bg-spiritless-pink/90 flex-1 sm:flex-none"
              asChild
            >
              <Link to="/create-bar-crawl" onClick={scrollToTop}>
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
          <div key={crawl.id} className="bg-card p-4 rounded-md shadow-sm border border-border hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 text-lg text-foreground">{crawl.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">{crawl.stops} stops</span>
              <Button variant="ghost" size="sm" asChild onClick={scrollToTop}>
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
