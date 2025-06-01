
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { RewardCampaign } from '@/types/rewards/campaigns';

interface CampaignListProps {
  campaigns: RewardCampaign[];
  onEdit: (campaign: RewardCampaign) => void;
  onDelete: (campaignId: string) => void;
  onCreate: () => void;
  onStatusChange: (campaignId: string, status: RewardCampaign['status']) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onEdit,
  onDelete,
  onCreate,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusVariant = (status: RewardCampaign['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <div className="flex gap-1">
                    {campaign.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusChange(campaign.id, 'paused')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusChange(campaign.id, 'active')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <div>{formatDate(campaign.start_date)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <div>{formatDate(campaign.end_date)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <div>{campaign.budget ? `$${campaign.budget}` : 'Not set'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Performance:</span>
                  <div>
                    {campaign.performance_metrics?.total_users_reached || 0} users reached
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'No campaigns found matching your search.' : 'No campaigns created yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
