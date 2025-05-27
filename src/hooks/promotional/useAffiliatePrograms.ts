
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AffiliateProgram } from '@/types/promotional';
import { AffiliateService } from '@/services/promotional';
import { toast } from 'sonner';

export const useAffiliatePrograms = (promoterId: string) => {
  const queryClient = useQueryClient();

  const {
    data: programs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['affiliatePrograms', promoterId],
    queryFn: () => AffiliateService.getPromoterPrograms(promoterId),
    enabled: !!promoterId
  });

  const createProgramMutation = useMutation({
    mutationFn: (data: Omit<AffiliateProgram, 'id' | 'created_at' | 'updated_at'>) =>
      AffiliateService.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliatePrograms', promoterId] });
      toast.success('Affiliate program created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create affiliate program: ${error.message}`);
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AffiliateProgram> }) =>
      AffiliateService.updateProgram(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliatePrograms', promoterId] });
      toast.success('Affiliate program updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update affiliate program: ${error.message}`);
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
