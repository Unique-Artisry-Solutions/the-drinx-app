
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickNavigationProps {
  handleTabChange: (tab: string) => void;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ handleTabChange }) => {
  const _establishmentId = 'placeholder'; // Prefixed to suppress warning
  const navigate = useNavigate();

  const _handleNavigate = () => {
    // Placeholder for future navigation functionality
    console.log('Navigation functionality to be implemented');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('analytics')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('allActions')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Events</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('allActions')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs">Customers</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('settings')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNavigation;
