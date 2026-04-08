
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingActionsCardProps {
  pendingSwigCircuits: number;
  pendingReviews: number;
}

const PendingActionsCard: React.FC<PendingActionsCardProps> = ({ pendingSwigCircuits, pendingReviews }) => {
  const navigate = useNavigate();
  
  // Function to navigate to the bar crawl requests page
  const navigateToSwigCircuitRequests = () => {
    navigate('/establishment/swig-circuit-requests');
  };
  
  // Function to navigate to the reviews page
  const navigateToAllReviews = () => {
    navigate('/establishment/reviews');
  };

  // Function to navigate to the all actions page
  const navigateToAllActions = () => {
    navigate('/establishment/all-actions');
  };

  return (
    <Card className="vibrant-card w-full">
      <CardHeader className="pb-2">
        <CardTitle>Pending Actions</CardTitle>
        <CardDescription>Items that need your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] p-3 rounded-md bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-spiritless-pink mr-2" />
              <div>
                <p className="text-sm font-medium">Swig Circuit Requests</p>
                <p className="text-xs text-material-on-surface-variant">{pendingSwigCircuits} pending requests</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={navigateToSwigCircuitRequests}>
              Review
            </Button>
          </div>
          
          <div className="flex-1 min-w-[200px] p-3 rounded-md bg-gradient-to-r from-spiritless-green/10 to-blue-400/10 flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-spiritless-green mr-2" />
              <div>
                <p className="text-sm font-medium">New Reviews</p>
                <p className="text-xs text-material-on-surface-variant">{pendingReviews} unread reviews</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={navigateToAllReviews}>
              View
            </Button>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Button className="w-full" variant="outline" onClick={navigateToAllActions}>
              View All Actions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingActionsCard;
