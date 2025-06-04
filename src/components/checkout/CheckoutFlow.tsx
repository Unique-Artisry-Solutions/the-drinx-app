
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckoutFlowProps {
  eventId: string;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ eventId }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Event ID: {eventId}</p>
          <p>This is a placeholder for the checkout flow component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutFlow;
