
import React, { useState } from 'react';
import { ComponentRewardCampaign } from '@/types/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Play, Pause } from 'lucide-react';

interface CampaignListProps {
  campaigns: ComponentRewardCampaign[];
  onEdit: (campaign: ComponentRewardCampaign) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: ComponentRewardCampaign['status']) => void;
}

export const CampaignList = ({ campaigns, onEdit, onDelete, onToggleStatus }: CampaignListProps) => {
  const getStatusColor = (status: ComponentRewardCampaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusToggle = (campaign: ComponentRewardCampaign) => {
    let newStatus: ComponentRewardCampaign['status'];
    
    if (campaign.status === 'active') {
      newStatus = 'paused';
    } else if (campaign.status === 'paused' || campaign.status === 'draft') {
      newStatus = 'active';
    } else {
      return; // Can't toggle completed, scheduled, or cancelled campaigns
    }
    
    onToggleStatus(campaign.id, newStatus);
  };

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No campaigns found. Create your first campaign to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {campaign.name}
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {(campaign.status === 'active' || campaign.status === 'paused' || campaign.status === 'draft') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusToggle(campaign)}
                  >
                    {campaign.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(campaign)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(campaign.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Budget</p>
                <p className="text-muted-foreground">${campaign.budget || 0}</p>
              </div>
              <div>
                <p className="font-medium">Rewards</p>
                <p className="text-muted-foreground">{campaign.rewards.length}</p>
              </div>
              <div>
                <p className="font-medium">Target Audience</p>
                <p className="text-muted-foreground">{campaign.targetAudience?.length || 0} filters</p>
              </div>
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-muted-foreground">
                  {campaign.performanceMetrics?.impressions || 0} impressions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
