
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketCancellationPolicy } from '@/types/TicketManagementTypes';
import { Plus, Shield, Percent } from 'lucide-react';

interface CancellationPolicyManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const CancellationPolicyManager: React.FC<CancellationPolicyManagerProps> = ({
  eventId,
  swigCircuitId
}) => {
  const { createCancellationPolicy, isCreatingPolicy } = useTicketManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    days_before_event: 7,
    refund_percentage: 80,
    processing_fee: 5
  });

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['cancellation-policies', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCancellationPolicies(eventId, swigCircuitId),
  });

  const handleCreatePolicy = () => {
    const policy: Omit<TicketCancellationPolicy, 'id' | 'created_at'> = {
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      days_before_event: formData.days_before_event,
      refund_percentage: formData.refund_percentage,
      processing_fee: formData.processing_fee,
      is_active: true
    };

    createCancellationPolicy(policy);
    setShowCreateForm(false);
    setFormData({
      days_before_event: 7,
      refund_percentage: 80,
      processing_fee: 5
    });
  };

  if (isLoading) {
    return <div>Loading cancellation policies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cancellation Policies</h2>
          <p className="text-muted-foreground">
            Manage refund policies for different time periods
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Cancellation Policy</CardTitle>
            <CardDescription>
              Set refund percentages based on how far in advance tickets are cancelled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="days">Days Before Event</Label>
                <Input
                  id="days"
                  type="number"
                  value={formData.days_before_event}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    days_before_event: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="percentage">Refund Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={formData.refund_percentage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    refund_percentage: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="fee">Processing Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  step="0.01"
                  value={formData.processing_fee}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    processing_fee: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePolicy} disabled={isCreatingPolicy}>
                {isCreatingPolicy ? 'Creating...' : 'Create Policy'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      {policy.days_before_event}+ days before
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      {policy.refund_percentage}% refund
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Processing fee: ${policy.processing_fee.toFixed(2)}
                  </div>
                </div>
                
                <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                  {policy.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {policies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No cancellation policies configured. Add one to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CancellationPolicyManager;
