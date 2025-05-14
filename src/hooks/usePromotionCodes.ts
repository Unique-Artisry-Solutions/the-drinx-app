
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPromotionCodes,
  createPromotionCode,
  updatePromotionCode,
  deletePromotionCode,
  batchCreatePromotionCodes,
  getPromotionAnalytics,
  exportPromotionCodesToCSV,
  parseCSVForImport,
  type PromotionCode,
  type CreatePromotionCodeParams,
  type BatchCreateParams,
  type PromotionAnalytics
} from '@/lib/promotions/api';
import { useToast } from './use-toast';

export function usePromotionCodes(establishmentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  
  // Fetch all promotion codes
  const { 
    data: promotionCodes = [],
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
    error: codesError,
    refetch: refetchCodes
  } = useQuery({
    queryKey: ['promotionCodes', establishmentId],
    queryFn: () => getPromotionCodes(establishmentId),
    enabled: !!establishmentId
  });

  // Fetch analytics data
  const {
    data: analyticsData = [],
    isLoading: isLoadingAnalytics,
    isError: isErrorAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['promotionAnalytics', establishmentId],
    queryFn: () => getPromotionAnalytics(establishmentId),
    enabled: !!establishmentId
  });

  // Create a single promotion code
  const createCodeMutation = useMutation({
    mutationFn: (params: CreatePromotionCodeParams) => createPromotionCode(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotionCodes', establishmentId] });
      toast({
        title: "Promotion code created",
        description: "The promotion code has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update a promotion code
  const updateCodeMutation = useMutation({
    mutationFn: ({ id, params }: { id: string, params: Partial<CreatePromotionCodeParams> }) => 
      updatePromotionCode(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotionCodes', establishmentId] });
      toast({
        title: "Promotion code updated",
        description: "The promotion code has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete a promotion code
  const deleteCodeMutation = useMutation({
    mutationFn: (id: string) => deletePromotionCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotionCodes', establishmentId] });
      toast({
        title: "Promotion code deleted",
        description: "The promotion code has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Batch create promotion codes
  const batchCreateMutation = useMutation({
    mutationFn: (params: BatchCreateParams) => batchCreatePromotionCodes(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotionCodes', establishmentId] });
      toast({
        title: "Batch creation successful",
        description: `Created ${data.length} promotion codes.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Batch creation failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Export promotion codes to CSV
  const exportCodes = () => {
    try {
      const csvContent = exportPromotionCodesToCSV(promotionCodes);
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up the download
      link.href = url;
      link.setAttribute('download', `promotion-codes-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${promotionCodes.length} codes exported to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: `Error exporting codes: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  // Import promotion codes from CSV
  const importCodes = async (csvData: string) => {
    try {
      setImporting(true);
      
      const parsedCodes = parseCSVForImport(csvData, establishmentId);
      
      // Create each code one by one
      let successCount = 0;
      let errorCount = 0;
      
      for (const codeData of parsedCodes) {
        try {
          await createPromotionCode(codeData);
          successCount++;
        } catch (error) {
          console.error('Error importing code:', error);
          errorCount++;
        }
      }
      
      // Refresh the list
      queryClient.invalidateQueries({ queryKey: ['promotionCodes', establishmentId] });
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} codes. Failed: ${errorCount}`,
        variant: errorCount > 0 ? "default" : "default"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return {
    promotionCodes,
    analyticsData,
    isLoadingCodes,
    isErrorCodes,
    codesError,
    isLoadingAnalytics,
    isErrorAnalytics,
    analyticsError,
    refetchCodes,
    refetchAnalytics,
    createCode: createCodeMutation.mutate,
    updateCode: updateCodeMutation.mutate,
    deleteCode: deleteCodeMutation.mutate,
    batchCreateCodes: batchCreateMutation.mutate,
    exportCodes,
    importCodes,
    importing,
    isCreating: createCodeMutation.isPending,
    isUpdating: updateCodeMutation.isPending,
    isDeleting: deleteCodeMutation.isPending,
    isBatchCreating: batchCreateMutation.isPending
  };
}
