
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentGatewayConfig } from '@/types/SupabaseTables';

interface UsePaymentGatewaysResult {
  paymentGateways: PaymentGatewayConfig[];
  isLoading: boolean;
  error: string | null;
  fetchPaymentGateways: () => Promise<void>;
  updatePaymentGateway: (id: string, updates: Partial<PaymentGatewayConfig>) => Promise<PaymentGatewayConfig | null>;
  createPaymentGateway: (gateway: Partial<PaymentGatewayConfig>) => Promise<PaymentGatewayConfig | null>;
  deletePaymentGateway: (id: string) => Promise<boolean>;
  toggleTestMode: (id: string) => Promise<boolean>;
}

export const usePaymentGateways = (): UsePaymentGatewaysResult => {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPaymentGateways = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .order('gateway_name');
        
      if (error) throw new Error(error.message);
      setPaymentGateways(data || []);
    } catch (err) {
      console.error('Error fetching payment gateways:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment gateways');
      toast({
        title: 'Error',
        description: 'Failed to load payment gateways. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentGateway = async (id: string, updates: Partial<PaymentGatewayConfig>) => {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setPaymentGateways(prev => 
        prev.map(gateway => gateway.id === id ? data as PaymentGatewayConfig : gateway)
      );
      
      toast({
        title: 'Success',
        description: 'Payment gateway updated successfully.',
      });
      
      return data as PaymentGatewayConfig;
    } catch (err) {
      console.error('Error updating payment gateway:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update payment gateway',
        variant: 'destructive'
      });
      return null;
    }
  };

  const createPaymentGateway = async (gateway: Partial<PaymentGatewayConfig>) => {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .insert({
          ...gateway,
          is_active: gateway.is_active ?? true,
          test_mode: gateway.test_mode ?? true,
          configuration: gateway.configuration ?? {},
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setPaymentGateways(prev => [...prev, data as PaymentGatewayConfig]);
      
      toast({
        title: 'Success',
        description: 'Payment gateway created successfully.',
      });
      
      return data as PaymentGatewayConfig;
    } catch (err) {
      console.error('Error creating payment gateway:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create payment gateway',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deletePaymentGateway = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_gateway_configs')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setPaymentGateways(prev => prev.filter(gateway => gateway.id !== id));
      
      toast({
        title: 'Success',
        description: 'Payment gateway deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting payment gateway:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete payment gateway',
        variant: 'destructive'
      });
      return false;
    }
  };

  const toggleTestMode = async (id: string) => {
    try {
      const gateway = paymentGateways.find(g => g.id === id);
      if (!gateway) throw new Error('Gateway not found');
      
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .update({ 
          test_mode: !gateway.test_mode,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setPaymentGateways(prev => 
        prev.map(g => g.id === id ? data as PaymentGatewayConfig : g)
      );
      
      toast({
        title: 'Success',
        description: `Test mode ${data.test_mode ? 'enabled' : 'disabled'} successfully.`,
      });
      
      return true;
    } catch (err) {
      console.error('Error toggling test mode:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to toggle test mode',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    paymentGateways,
    isLoading,
    error,
    fetchPaymentGateways,
    updatePaymentGateway,
    createPaymentGateway,
    deletePaymentGateway,
    toggleTestMode
  };
};
