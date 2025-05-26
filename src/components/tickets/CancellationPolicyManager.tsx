
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
import { Plus, Edit, Trash } from 'lucide-react';

interface CancellationPolicyManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const CancellationPolicyManager: React.FC<CancellationPolicyManagerProps> = ({
  eventId,
  swigCircuitId
}) => {
  const { createCancellationPolicy, isCreatingPolicy } = useTicketManagement();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    days_before_event: 7,
    refund_percentage: 100,
    processing_fee: 0
  });

  const { data: policies, isLoading } = useQuery({
    queryKey: ['cancellation-policies', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCancellationPolicies(eventId, swigCircuitId),
  });

  const handleCreatePolicy = () => {
    const policyData = {
      ...newPolicy,
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      is_active: true
    };

    createCancellationPolicy(policyData, {
      onSuccess: () => {
        setShowAddForm(false);
        setNewPolicy({
          days_before_event: 7,
          refund_percentage: 100,
          processing_fee: 0
        });
      }
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
            Set refund policies based on how far in advance cancellations occur
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Cancellation Policy</CardTitle>
            <CardDescription>
              Define refund terms for different cancellation timeframes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="days">Days Before Event</Label>
                <Input
                  id="days"
                  type="number"
                  min="0"
                  value={newPolicy.days_before_event}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    days_before_event: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="percentage">Refund Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={newPolicy.refund_percentage}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    refund_percentage: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fee">Processing Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPolicy.processing_fee}
                  onChange={(e) => setNewPolicy({
                    ...newPolicy,
                    processing_fee: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={handleCreatePolicy}
                disabled={isCreatingPolicy}
              >
                {isCreatingPolicy ? 'Creating...' : 'Create Policy'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {policies?.map((policy) => (
          <Card key={policy.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {policy.days_before_event}+ days before event
                    </h3>
                    <Badge variant={policy.is_active ? "default" : "secondary"}>
                      {policy.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{policy.refund_percentage}% refund</span>
                    {policy.processing_fee > 0 && (
                      <span> • ${policy.processing_fee} processing fee</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {policies?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No cancellation policies set. Add policies to define refund terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CancellationPolicyManager;
