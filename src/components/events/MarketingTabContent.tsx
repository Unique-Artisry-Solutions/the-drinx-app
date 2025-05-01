
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Mail, Share2, Link, Unlink } from 'lucide-react';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';
import { EventMarketingCampaign } from '@/types/EventTypes';
import MarketingCampaignModal from './MarketingCampaignModal';
import SocialSharingPanel from './SocialSharingPanel';
import EmailMarketingPanel from './EmailMarketingPanel';
import IntegrationsPanel from './IntegrationsPanel';

interface MarketingTabContentProps {
  eventId: string;
  eventName: string;
}

const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EventMarketingCampaign | undefined>();
  
  const { 
    campaigns, 
    isLoading, 
    error, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign,
    trackMetric,
    getCampaignLink,
    refresh
  } = useEventMarketing(eventId);

  const handleCreateCampaign = async (campaign: Omit<EventMarketingCampaign, 'event_id'>) => {
    try {
      await createCampaign(campaign);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  const handleUpdateCampaign = async (campaign: Partial<EventMarketingCampaign>) => {
    if (!editingCampaign?.id) return;
    
    try {
      await updateCampaign(editingCampaign.id, campaign);
      setIsModalOpen(false);
      setEditingCampaign(undefined);
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        await deleteCampaign(id);
        toast({
          title: "Campaign Deleted",
          description: "The marketing campaign has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete campaign",
          variant: "destructive",
        });
      }
    }
  };

  const openCampaignModal = (campaign?: EventMarketingCampaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleTrackMetric = async (campaignId: string, metricType: string) => {
    await trackMetric(campaignId, metricType);
    toast({
      title: "Metric Tracked",
      description: `${metricType} interaction has been recorded`,
    });
  };

  const formatCampaignType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="social">Social Sharing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Marketing Campaigns</CardTitle>
                  <CardDescription>
                    Create and manage marketing campaigns for {eventName}
                  </CardDescription>
                </div>
                <Button onClick={() => openCampaignModal()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading campaigns...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading campaigns. Please try again.</p>
                </div>
              ) : campaigns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Campaign Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Start Date</th>
                        <th className="px-4 py-3">End Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(campaign => (
                        <tr key={campaign.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{campaign.name}</td>
                          <td className="px-4 py-3">{formatCampaignType(campaign.campaign_type)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              campaign.status === 'draft' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              campaign.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-3">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openCampaignModal(campaign)}>
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteCampaign(campaign.id || '')}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No marketing campaigns found. Create your first campaign to start promoting your event.</p>
                  <Button onClick={() => openCampaignModal()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <EmailMarketingPanel eventId={eventId} eventName={eventName} campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="social">
          <SocialSharingPanel eventId={eventId} eventName={eventName} campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationsPanel eventId={eventId} />
        </TabsContent>
      </Tabs>
      
      <MarketingCampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(undefined);
        }}
        onSave={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
        campaign={editingCampaign}
        isEditing={!!editingCampaign}
      />
    </>
  );
};

export default MarketingTabContent;
