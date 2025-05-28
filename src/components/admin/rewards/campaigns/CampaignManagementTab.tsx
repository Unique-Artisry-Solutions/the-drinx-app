
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Pause, Trash2, RefreshCw } from 'lucide-react';
import { useCampaigns } from '@/hooks/rewards/useCampaigns';
import { RewardCampaign } from '@/types/rewards';

interface CampaignManagementTabProps {
  establishmentId?: string;
}

export const CampaignManagementTab: React.FC<CampaignManagementTabProps> = ({ establishmentId }) => {
  const {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    activateCampaign,
    deactivateCampaign,
    fetchCampaigns
  } = useCampaigns();

  const handleCreateCampaign = async () => {
    try {
      await createCampaign({
        name: 'New Campaign',
        description: 'Campaign description',
        status: 'draft'
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleActivateCampaign = async (campaignId: string) => {
    try {
      await activateCampaign(campaignId);
    } catch (error) {
      console.error('Failed to activate campaign:', error);
    }
  };

  const handleDeactivateCampaign = async (campaignId: string) => {
    try {
      await deactivateCampaign(campaignId);
    } catch (error) {
      console.error('Failed to deactivate campaign:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const getStatusBadgeVariant = (status: RewardCampaign['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded-md" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reward Campaigns</CardTitle>
          <div className="flex gap-2">
            <Button onClick={fetchCampaigns} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleCreateCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground">
              No campaigns found. Create your first campaign to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {campaign.budget && (
                          <span>Budget: ${campaign.budget}</span>
                        )}
                        {campaign.performance_metrics && (
                          <span>
                            Reached: {campaign.performance_metrics.total_users_reached || 0} users
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'active' ? (
                        <Button
                          onClick={() => handleDeactivateCampaign(campaign.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivateCampaign(campaign.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignManagementTab;
