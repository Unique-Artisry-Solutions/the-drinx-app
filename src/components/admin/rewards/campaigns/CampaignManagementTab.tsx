
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter } from 'lucide-react';
import { CampaignForm } from './CampaignForm';
import { RewardCampaign } from '@/types/rewards/campaigns';

interface CampaignManagementTabProps {
  _establishmentId: string;
}

export function CampaignManagementTab({ _establishmentId }: CampaignManagementTabProps) {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RewardCampaign | undefined>();

  const handleSaveCampaign = (campaignData: Partial<RewardCampaign>) => {
    if (selectedCampaign) {
      // Update existing campaign
      setCampaigns(prev => prev.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, ...campaignData } as RewardCampaign
          : c
      ));
    } else {
      // Create new campaign
      const newCampaign: RewardCampaign = {
        id: `campaign-${Date.now()}`,
        name: campaignData.name || '',
        description: campaignData.description || '',
        status: campaignData.status || 'draft',
        start_date: campaignData.start_date || '',
        end_date: campaignData.end_date || '',
        budget: campaignData.budget || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCampaigns(prev => [...prev, newCampaign]);
    }
    setShowCreateForm(false);
    setSelectedCampaign(undefined);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setSelectedCampaign(undefined);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  if (showCreateForm) {
    return (
      <CampaignForm
        campaign={selectedCampaign}
        onSave={handleSaveCampaign}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campaign Management</CardTitle>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 mt-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No campaigns found. Create your first campaign to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{campaign.start_date} - {campaign.end_date}</span>
                              <span>•</span>
                              <span>Budget: ${campaign.budget}</span>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
