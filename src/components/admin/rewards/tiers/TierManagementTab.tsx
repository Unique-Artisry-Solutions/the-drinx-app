
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { transformRewardTier } from '@/types/rewards';

interface TierManagementTabProps {
  establishmentId?: string;
}

export const TierManagementTab: React.FC<TierManagementTabProps> = ({ establishmentId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reward Tiers</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No reward tiers configured yet. Create your first tier to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierManagementTab;
