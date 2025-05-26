
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TicketManagementService } from '@/services/ticketManagementService';
import { BulkTicketOperation } from '@/types/TicketManagementTypes';

export const useTicketManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  // Inventory queries
  const {
    data: inventory,
    isLoading: inventoryLoading,
    refetch: refetchInventory
  } = useQuery({
    queryKey: ['ticket-inventory'],
    queryFn: () => TicketManagementService.getTicketInventory(),
  });

  // Transfer mutations
  const transferTicketMutation = useMutation({
    mutationFn: ({ ticketId, toEmail }: { ticketId: string; toEmail: string }) =>
      TicketManagementService.initiateTicketTransfer(ticketId, toEmail),
    onSuccess: () => {
      toast({
        title: "Transfer Initiated",
        description: "Ticket transfer has been initiated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ticket-transfers'] });
    },
    onError: (error) => {
      toast({
        title: "Transfer Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const acceptTransferMutation = useMutation({
    mutationFn: (transferCode: string) =>
      TicketManagementService.acceptTicketTransfer(transferCode),
    onSuccess: () => {
      toast({
        title: "Transfer Accepted",
        description: "Ticket has been transferred to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ['ticket-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-purchases'] });
    },
    onError: (error) => {
      toast({
        title: "Transfer Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Refund mutations
  const requestRefundMutation = useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason?: string }) =>
      TicketManagementService.requestTicketRefund(ticketId, reason),
    onSuccess: () => {
      toast({
        title: "Refund Requested",
        description: "Your refund request has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['ticket-refunds'] });
    },
    onError: (error) => {
      toast({
        title: "Refund Request Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const processRefundMutation = useMutation({
    mutationFn: ({ refundId, approved }: { refundId: string; approved: boolean }) =>
      TicketManagementService.processTicketRefund(refundId, approved),
    onSuccess: () => {
      toast({
        title: "Refund Processed",
        description: "Refund has been processed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ticket-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-purchases'] });
    },
    onError: (error) => {
      toast({
        title: "Refund Processing Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Bulk operations
  const bulkOperationMutation = useMutation({
    mutationFn: (operation: BulkTicketOperation) =>
      TicketManagementService.performBulkOperation(operation),
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "Bulk Operation Complete",
        description: `${successful} operations successful, ${failed} failed.`,
        variant: failed > 0 ? "destructive" : "default",
      });
      
      setSelectedTickets([]);
      queryClient.invalidateQueries({ queryKey: ['ticket-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-refunds'] });
    },
    onError: (error) => {
      toast({
        title: "Bulk Operation Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Cancellation policy mutations
  const createPolicyMutation = useMutation({
    mutationFn: TicketManagementService.createCancellationPolicy,
    onSuccess: () => {
      toast({
        title: "Policy Created",
        description: "Cancellation policy has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['cancellation-policies'] });
    },
    onError: (error) => {
      toast({
        title: "Policy Creation Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    inventory,
    selectedTickets,
    
    // Loading states
    inventoryLoading,
    isTransferring: transferTicketMutation.isPending,
    isAcceptingTransfer: acceptTransferMutation.isPending,
    isRequestingRefund: requestRefundMutation.isPending,
    isProcessingRefund: processRefundMutation.isPending,
    isBulkOperating: bulkOperationMutation.isPending,
    isCreatingPolicy: createPolicyMutation.isPending,
    
    // Actions
    setSelectedTickets,
    refetchInventory,
    transferTicket: transferTicketMutation.mutate,
    acceptTransfer: acceptTransferMutation.mutate,
    requestRefund: requestRefundMutation.mutate,
    processRefund: processRefundMutation.mutate,
    performBulkOperation: bulkOperationMutation.mutate,
    createCancellationPolicy: createPolicyMutation.mutate,
    
    // Service methods
    getTicketPurchases: TicketManagementService.getTicketPurchases,
    getCancellationPolicies: TicketManagementService.getCancellationPolicies,
    calculateRefund: TicketManagementService.calculateRefund,
  };
};
