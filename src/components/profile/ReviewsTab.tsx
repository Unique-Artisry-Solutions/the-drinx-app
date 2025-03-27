
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ReviewsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <h2 className="font-medium">Reviews I've Written</h2>
      
      <div className="text-center py-8">
        <p className="text-material-on-surface-variant">
          You haven't written any reviews yet.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/explore')}
        >
          Explore Mocktails
        </Button>
      </div>
    </div>
  );
};

export default ReviewsTab;
