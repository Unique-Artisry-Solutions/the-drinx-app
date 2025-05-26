
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as eventTicketService from '@/services/eventTicketService';

export const useEventTicketing = (eventId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    valid: boolean;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    message?: string;
  } | null>(null);

  // Fetch ticket types for the event
  const { 
    data: ticketTypes, 
    isLoading: ticketTypesLoading,
    error: ticketTypesError 
  } = useQuery({
    queryKey: ['eventTicketTypes', eventId],
    queryFn: () => eventTicketService.fetchEventTicketTypes(eventId),
    enabled: !!eventId
  });

  // Apply discount code
  const applyDiscountMutation = useMutation({
    mutationFn: ({ code, ticketTypeId }: { code: string; ticketTypeId: string }) => 
      eventTicketService.applyDiscountCode(code, eventId, ticketTypeId),
    onSuccess: (data: eventTicketService.DiscountValidationResult) => {
      setAppliedDiscount(data);
      if (data.valid) {
        toast({
          title: "Discount applied",
          description: data.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Discount invalid",
          description: data.message,
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error applying discount",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  // Create discount code
  const createDiscountCodeMutation = useMutation({
    mutationFn: (discountData: {
      code: string;
      discountType: 'percentage' | 'fixed';
      discountAmount: number;
      expiresAt?: Date;
      usageLimit?: number;
      applicableTicketTypes?: string[];
      description?: string;
    }) => eventTicketService.createDiscountCode({
      event_id: eventId,
      ...discountData
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventDiscountCodes', eventId] });
      toast({
        title: "Discount code created",
        description: "The discount code has been created successfully.",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating discount code",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  // Check ticket availability
  const checkAvailabilityMutation = useMutation({
    mutationFn: (ticketTypeId: string) => 
      eventTicketService.checkTicketAvailability(eventId, ticketTypeId),
  });

  // Process ticket purchase
  const purchaseTicketMutation = useMutation({
    mutationFn: (purchaseData: {
      ticketTypeId: string;
      quantity: number;
      userId?: string;
      customerName: string;
      customerEmail: string;
      discountCode?: string;
      paymentMethodId?: string;
    }) => eventTicketService.processTicketPurchase({
      event_id: eventId,
      ...purchaseData
    }),
    onSuccess: (data: eventTicketService.TicketPurchaseResult) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['eventTicketTypes', eventId] });
        toast({
          title: "Purchase successful",
          description: "Your tickets have been purchased successfully.",
          variant: "default"
        });
      } else {
        toast({
          title: "Purchase failed",
          description: data.error || "There was an error processing your purchase.",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error processing purchase",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const calculatePrice = (basePrice: number, quantity: number): {
    subtotal: number;
    discount: number;
    total: number;
  } => {
    const subtotal = basePrice * quantity;
    let discount = 0;
    
    if (appliedDiscount?.valid) {
      if (appliedDiscount.discountType === 'percentage') {
        discount = subtotal * (appliedDiscount.discountAmount / 100);
      } else {
        discount = Math.min(subtotal, appliedDiscount.discountAmount * quantity);
      }
    }
    
    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  return {
    // Data
    ticketTypes,
    discountCode,
    appliedDiscount,
    
    // Loading states
    ticketTypesLoading,
    isApplyingDiscount: applyDiscountMutation.isPending,
    isCreatingDiscountCode: createDiscountCodeMutation.isPending,
    isCheckingAvailability: checkAvailabilityMutation.isPending,
    isPurchasing: purchaseTicketMutation.isPending,
    
    // Errors
    ticketTypesError,
    
    // Actions
    setDiscountCode,
    applyDiscount: (ticketTypeId: string) => {
      if (!discountCode) return;
      applyDiscountMutation.mutate({ code: discountCode, ticketTypeId });
    },
    createDiscountCode: createDiscountCodeMutation.mutate,
    checkAvailability: checkAvailabilityMutation.mutate,
    purchaseTicket: purchaseTicketMutation.mutate,
    calculatePrice
  };
};
