
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PricingRule } from '@/types/promotional';
import { PricingService } from '@/services/promotional';
import { toast } from 'sonner';

export const usePricingRules = (promoterId: string) => {
  const queryClient = useQueryClient();

  const {
    data: rules = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['pricingRules', promoterId],
    queryFn: () => PricingService.getPromoterRules(promoterId),
    enabled: !!promoterId
  });

  const createRuleMutation = useMutation({
    mutationFn: (data: Omit<PricingRule, 'id' | 'created_at' | 'updated_at'>) =>
      PricingService.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules', promoterId] });
      toast.success('Pricing rule created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create pricing rule: ${error.message}`);
    }
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PricingRule> }) =>
      PricingService.updateRule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules', promoterId] });
      toast.success('Pricing rule updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update pricing rule: ${error.message}`);
    }
  });

  return {
    rules,
    isLoading,
    error,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending
  };
};
