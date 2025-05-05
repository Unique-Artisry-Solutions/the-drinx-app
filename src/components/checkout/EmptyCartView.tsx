
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/navigation/BackButton';

interface EmptyCartViewProps {
  isLoggedIn: boolean;
}

const EmptyCartView: React.FC<EmptyCartViewProps> = ({ isLoggedIn }) => {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
      <div className="w-full flex justify-start mb-6">
        <BackButton 
          fallbackPath="/events" 
          variant="ghost" 
          size="sm"
          label="Back" 
          showLabel={true}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
      <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
      <Link to={isLoggedIn ? "/events" : "/pricing"}>
        <Button>{isLoggedIn ? "View All Events" : "View Plans"}</Button>
      </Link>
    </div>
  );
};

export default EmptyCartView;
