
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PurchaseSuccessProps {
  sessionId: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ sessionId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Session ID: {sessionId}</p>
          <p>Thank you for your purchase!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseSuccess;
