
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PurchaseConfirmationProps {
  sessionId: string;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({ sessionId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Session ID: {sessionId}</p>
          <p>This is a placeholder for the purchase confirmation component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseConfirmation;
