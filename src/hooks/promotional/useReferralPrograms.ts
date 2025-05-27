
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReferralProgram } from '@/types/promotional';
import { ReferralService } from '@/services/promotional';
import { toast } from 'sonner';

export const useReferralPrograms = (promoterId: string) => {
  const queryClient = useQueryClient();

  const {
    data: programs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['referralPrograms', promoterId],
    queryFn: () => ReferralService.getPromoterPrograms(promoterId),
    enabled: !!promoterId
  });

  const createProgramMutation = useMutation({
    mutationFn: (data: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>) =>
      ReferralService.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralPrograms', promoterId] });
      toast.success('Referral program created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create referral program: ${error.message}`);
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ReferralProgram> }) =>
      ReferralService.updateProgram(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralPrograms', promoterId] });
      toast.success('Referral program updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update referral program: ${error.message}`);
    }
  });

  return {
    programs,
    isLoading,
    error,
    createProgram: createProgramMutation.mutate,
    updateProgram: updateProgramMutation.mutate,
    isCreating: createProgramMutation.isPending,
    isUpdating: updateProgramMutation.isPending
  };
};
