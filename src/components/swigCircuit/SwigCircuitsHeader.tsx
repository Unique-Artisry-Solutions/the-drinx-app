
import React from 'react';
import { Link } from 'react-router-dom';
import { Route, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface SwigCircuitsHeaderProps {
  user: User | null;
}

const SwigCircuitsHeader: React.FC<SwigCircuitsHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-material-on-background">
          <Route className="inline mr-2 h-8 w-8 text-spiritless-pink" />
          Swig Circuits
        </h1>
        <p className="text-material-on-surface-variant">
          Discover and join exciting alcohol-free swig circuits in your area
        </p>
      </div>
      
      {user && (
        <Button asChild className="bg-spiritless-pink hover:bg-spiritless-pink/90 shadow-md">
          <Link to="/create-bar-crawl" className="flex items-center gap-2">
            <PlusCircle size={18} />
            Create Circuit
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SwigCircuitsHeader;
