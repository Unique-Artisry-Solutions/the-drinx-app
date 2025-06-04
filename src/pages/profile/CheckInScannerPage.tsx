import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

const CheckInScannerPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Check-In Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the check-in scanner page.</p>
            <Button>Scan Now</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckInScannerPage;
