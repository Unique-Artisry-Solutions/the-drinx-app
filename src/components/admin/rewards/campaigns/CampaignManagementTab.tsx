
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface CampaignManagementTabProps {
  _establishmentId: string;
}

export function CampaignManagementTab({ _establishmentId }: CampaignManagementTabProps) {
  const [campaigns] = useState([
    { id: '1', name: 'Holiday Special', status: 'active', startDate: '2024-01-01' },
    { id: '2', name: 'New User Bonus', status: 'draft', startDate: '2024-02-01' }
  ]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Campaign Management</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No campaigns found. Create your first campaign to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">Start Date: {campaign.startDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
