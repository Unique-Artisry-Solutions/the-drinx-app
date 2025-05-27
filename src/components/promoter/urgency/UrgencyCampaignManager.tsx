
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUrgencyCampaigns } from '@/hooks/promotional/useUrgencyCampaigns';
import { UrgencyCampaign } from '@/types/promotional';
import { Plus, Edit, Trash, BarChart3, Eye, TrendingUp } from 'lucide-react';

interface UrgencyCampaignManagerProps {
  promoterId: string;
  onCreateCampaign?: () => void;
  onEditCampaign?: (campaign: UrgencyCampaign) => void;
}

export const UrgencyCampaignManager: React.FC<UrgencyCampaignManagerProps> = ({
  promoterId,
  onCreateCampaign,
  onEditCampaign
}) => {
  const { campaigns, isLoading } = useUrgencyCampaigns(promoterId);
  const [updatingCampaigns, setUpdatingCampaigns] = useState<Set<string>>(new Set());

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'limited_time': return 'bg-orange-100 text-orange-800';
      case 'limited_quantity': return 'bg-red-100 text-red-800';
      case 'early_bird': return 'bg-green-100 text-green-800';
      case 'last_chance': return 'bg-red-100 text-red-800';
      case 'flash_sale': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCampaignType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Urgency Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Urgency Campaigns
        </CardTitle>
        <Button onClick={onCreateCampaign} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground mb-4">No urgency campaigns created yet</p>
            <Button onClick={onCreateCampaign} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{campaign.campaign_name}</h4>
                      <Badge className={getCampaignTypeColor(campaign.campaign_type)}>
                        {formatCampaignType(campaign.campaign_type)}
                      </Badge>
                      <Badge variant={campaign.is_active ? 'default' : 'secondary'}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.message_template}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={campaign.is_active}
                      disabled={updatingCampaigns.has(campaign.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCampaign?.(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Campaign Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Displays</div>
                    <div className="font-semibold">{campaign.current_displays}</div>
                    {campaign.max_displays && (
                      <div className="text-xs text-muted-foreground">
                        / {campaign.max_displays}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Conversions</div>
                    <div className="font-semibold">{campaign.conversion_count}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Rate</div>
                    <div className="font-semibold">
                      {campaign.current_displays > 0 
                        ? ((campaign.conversion_count / campaign.current_displays) * 100).toFixed(1)
                        : '0'
                      }%
                    </div>
                  </div>
                </div>

                {/* Campaign Duration */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    <strong>Active:</strong> {new Date(campaign.start_date).toLocaleDateString()}
                    {campaign.end_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
