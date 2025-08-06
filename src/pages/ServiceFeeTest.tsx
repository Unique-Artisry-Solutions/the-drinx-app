import React from 'react';
import ServiceFeeTestComponent from '@/components/test/ServiceFeeTestComponent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceFeeTest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Service Fee Testing</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test the service fee calculation and validation functionality. 
              Add items to the cart and verify that the service fee is calculated correctly 
              based on the current configuration.
            </p>
          </div>
        </div>
        
        <ServiceFeeTestComponent />
        
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground">
            <p>This page is for testing purposes only.</p>
            <p>Service fee settings can be modified in the admin panel under Payment Settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeeTest;