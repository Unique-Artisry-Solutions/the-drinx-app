
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Target, Users, Clock, ChartBar } from 'lucide-react';
import { useCampaigns } from '@/hooks/rewards/useCampaigns';
import { CampaignList } from './CampaignList';
import { CampaignForm } from './CampaignForm';
import { CampaignPerformance } from './CampaignPerformance';
import { CampaignScheduler } from './CampaignScheduler';
import { AudienceTargeting } from './AudienceTargeting';
import { Badge } from '@/components/ui/badge';
import { RewardCampaign } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';

export const CampaignManagementTab = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<RewardCampaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const { 
    campaigns,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    activateCampaign,
    deactivateCampaign,
    fetchCampaigns
  } = useCampaigns();

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateCampaign = async (campaignData: Partial<RewardCampaign>) => {
    try {
      await createCampaign(campaignData);
      toast({
        title: "Campaign Created",
        description: "The campaign was created successfully.",
      });
      setActiveView('list');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateCampaign = async (campaignId: string, campaignData: Partial<RewardCampaign>) => {
    try {
      await updateCampaign(campaignId, campaignData);
      toast({
        title: "Campaign Updated",
        description: "The campaign was updated successfully.",
      });
      setActiveView('list');
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      toast({
        title: "Campaign Deleted",
        description: "The campaign was deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleActivation = async (campaign: RewardCampaign) => {
    try {
      if (campaign.is_active) {
        await deactivateCampaign(campaign.id);
        toast({
          title: "Campaign Deactivated",
          description: "The campaign has been deactivated.",
        });
      } else {
        await activateCampaign(campaign.id);
        toast({
          title: "Campaign Activated",
          description: "The campaign has been activated.",
        });
      }
    } catch (error) {
      console.error('Error toggling campaign activation:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditCampaign = (campaign: RewardCampaign) => {
    setSelectedCampaign(campaign);
    setActiveView('edit');
  };
  
  const handleRefresh = () => {
    fetchCampaigns();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Reward Campaign Management</CardTitle>
              <CardDescription>
                Create, manage and track time-limited reward campaigns
              </CardDescription>
            </div>
            {activeView === 'list' ? (
              <Button onClick={() => setActiveView('create')}>
                Create Campaign
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setActiveView('list');
                setSelectedCampaign(null);
              }}>
                Back to Campaigns
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeView === 'list' && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                
                <Tabs defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Refresh
                </Button>
              </div>
              
              <CampaignList 
                campaigns={filteredCampaigns} 
                isLoading={isLoading}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
                onToggleActivation={handleToggleActivation}
              />
            </>
          )}
          
          {activeView === 'create' && (
            <CampaignForm
              onSubmit={handleCreateCampaign}
              onCancel={() => setActiveView('list')}
            />
          )}
          
          {activeView === 'edit' && selectedCampaign && (
            <CampaignForm
              campaign={selectedCampaign}
              onSubmit={(data) => handleUpdateCampaign(selectedCampaign.id, data)}
              onCancel={() => {
                setActiveView('list');
                setSelectedCampaign(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
