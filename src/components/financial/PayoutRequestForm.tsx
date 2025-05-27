
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createPayoutRequest, calculateFeesAndTaxes } from '@/services/financialService';
import { FeeCalculation } from '@/types/FinancialTypes';

interface PayoutRequestFormProps {
  eventId?: string;
  swigCircuitId?: string;
  onSuccess?: () => void;
}

export default function PayoutRequestForm({ eventId, swigCircuitId, onSuccess }: PayoutRequestFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [bankDetails, setBankDetails] = useState({
    account_holder_name: '',
    account_number: '',
    routing_number: '',
    bank_name: ''
  });
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculation | null>(null);

  const calculateFees = async (inputAmount: string) => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setFeeCalculation(null);
      return;
    }

    try {
      const calculation = await calculateFeesAndTaxes(parseFloat(inputAmount));
      setFeeCalculation(calculation);
    } catch (error) {
      console.error('Error calculating fees:', error);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    calculateFees(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createPayoutRequest({
        event_id: eventId,
        swig_circuit_id: swigCircuitId,
        amount: parseFloat(amount),
        payout_method: {
          type: payoutMethod,
          details: payoutMethod === 'bank_transfer' ? bankDetails : {}
        }
      });

      toast({
        title: "Payout request submitted",
        description: "Your payout request has been submitted for processing"
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Failed to submit payout request",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Payout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          {feeCalculation && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Payout Breakdown</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Gross Amount:</span>
                  <span>${feeCalculation.gross_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>-${feeCalculation.platform_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>-${feeCalculation.processing_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Withholding:</span>
                  <span>-${feeCalculation.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Net Amount:</span>
                  <span>${feeCalculation.net_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="payout-method">Payout Method</Label>
            <Select value={payoutMethod} onValueChange={setPayoutMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe Connect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {payoutMethod === 'bank_transfer' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="account-holder">Account Holder Name</Label>
                <Input
                  id="account-holder"
                  value={bankDetails.account_holder_name}
                  onChange={(e) => setBankDetails(prev => ({ 
                    ...prev, 
                    account_holder_name: e.target.value 
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  value={bankDetails.account_number}
                  onChange={(e) => setBankDetails(prev => ({ 
                    ...prev, 
                    account_number: e.target.value 
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  value={bankDetails.routing_number}
                  onChange={(e) => setBankDetails(prev => ({ 
                    ...prev, 
                    routing_number: e.target.value 
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  value={bankDetails.bank_name}
                  onChange={(e) => setBankDetails(prev => ({ 
                    ...prev, 
                    bank_name: e.target.value 
                  }))}
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Payout Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
