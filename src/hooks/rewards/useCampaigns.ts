
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ComponentRewardCampaign } from '@/types/components';
import { createMockCampaign } from '@/lib/adapters/mockDataFactory';

export const useCampaigns = () => {
  const queryClient = useQueryClient();
  
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<ComponentRewardCampaign[]> => {
      // Mock data for now - replace with actual API call
      return [
        createMockCampaign({
          id: '1',
          name: 'Welcome Campaign',
          status: 'active',
          isActive: true
        }),
        createMockCampaign({
          id: '2',
          name: 'Holiday Special',
          status: 'scheduled',
          isActive: false
        })
      ];
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: Partial<ComponentRewardCampaign>) => {
      // Mock implementation
      const newCampaign = createMockCampaign({
        ...campaignData,
        id: Date.now().toString()
      });
      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ComponentRewardCampaign> }) => {
      // Mock implementation
      return createMockCampaign({ id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      console.log('Deleting campaign:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  return {
    campaigns: campaigns || [],
    isLoading,
    error,
    createCampaign: createCampaignMutation.mutate,
    updateCampaign: updateCampaignMutation.mutate,
    deleteCampaign: deleteCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending,
    isUpdating: updateCampaignMutation.isPending,
    isDeleting: deleteCampaignMutation.isPending
  };
};
