
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UrgencyCampaign } from '@/types/promotional';
import { UrgencyService } from '@/services/promotional';
import { toast } from 'sonner';

export const useUrgencyCampaigns = (promoterId: string) => {
  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['urgencyCampaigns', promoterId],
    queryFn: () => UrgencyService.getPromoterCampaigns(promoterId),
    enabled: !!promoterId
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: Omit<UrgencyCampaign, 'id' | 'created_at' | 'updated_at'>) =>
      UrgencyService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urgencyCampaigns', promoterId] });
      toast.success('Urgency campaign created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create urgency campaign: ${error.message}`);
    }
  });

  return {
    campaigns,
    isLoading,
    error,
    createCampaign: createCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending
  };
};
