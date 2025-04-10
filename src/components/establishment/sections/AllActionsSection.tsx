
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Tag, Route } from 'lucide-react';

interface AllActionsSectionProps {
  handleTabChange: (tab: string) => void;
}

const AllActionsSection: React.FC<AllActionsSectionProps> = ({ handleTabChange }) => {
  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold mb-4">All Actions</h1>
        <p>Quick access to all establishment management actions.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleTabChange('menu')}>
            <h3 className="font-medium flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Update Menu
            </h3>
          </Card>
          <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleTabChange('promotions')}>
            <h3 className="font-medium flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Manage Promotions
            </h3>
          </Card>
          <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleTabChange('barCrawls')}>
            <h3 className="font-medium flex items-center gap-2">
              <Route className="h-5 w-5" />
              Review Swig Circuit Requests
            </h3>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllActionsSection;
