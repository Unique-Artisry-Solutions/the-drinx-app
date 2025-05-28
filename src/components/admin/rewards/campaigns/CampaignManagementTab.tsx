
import React, { useState } from 'react';
import { ComponentRewardCampaign } from '@/types/components';
import { useCampaigns } from '@/hooks/rewards/useCampaigns';
import { CampaignList } from './CampaignList';
import { CampaignForm } from './CampaignForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const CampaignManagementTab = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ComponentRewardCampaign | null>(null);
  
  const {
    campaigns,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    isCreating: isSubmitting
  } = useCampaigns();

  const handleCreate = () => {
    setIsCreating(true);
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: ComponentRewardCampaign) => {
    setEditingCampaign(campaign);
    setIsCreating(true);
  };

  const handleSubmit = (data: Partial<ComponentRewardCampaign>) => {
    if (editingCampaign) {
      updateCampaign({ id: editingCampaign.id, data });
    } else {
      createCampaign(data);
    }
    setIsCreating(false);
    setEditingCampaign(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCampaign(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  const handleToggleStatus = (id: string, newStatus: ComponentRewardCampaign['status']) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      updateCampaign({
        id,
        data: {
          status: newStatus,
          isActive: newStatus === 'active'
        }
      });
    }
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  if (isCreating) {
    return (
      <CampaignForm
        campaign={editingCampaign || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reward Campaigns</CardTitle>
              <CardDescription>
                Manage your reward campaigns and track their performance
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
      </Card>

      <CampaignList
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
