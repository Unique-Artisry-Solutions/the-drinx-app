
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AutomatedCampaignManagerProps {
  promoterId: string;
}

const AutomatedCampaignManager: React.FC<AutomatedCampaignManagerProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Automated campaign management coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default AutomatedCampaignManager;
