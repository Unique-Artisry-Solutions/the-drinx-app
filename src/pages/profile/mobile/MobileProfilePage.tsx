
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileActiveSwigCircuitSection from '@/components/profile/mobile/MobileActiveSwigCircuitSection';

const MobileProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the mobile profile page.</p>
        </CardContent>
      </Card>
      
      <MobileActiveSwigCircuitSection />
    </div>
  );
};

export default MobileProfilePage;
