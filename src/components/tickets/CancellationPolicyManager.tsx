
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketCancellationPolicy } from '@/types/TicketManagementTypes';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface CancellationPolicyManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const CancellationPolicyManager: React.FC<CancellationPolicyManagerProps> = ({
  eventId,
  swigCircuitId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['cancellation-policies', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCancellationPolicies({
      eventId,
      swigCircuitId
    }),
  });

  const createPolicyMutation = useMutation({
    mutationFn: TicketManagementService.createCancellationPolicy,
    onSuccess: () => {
      toast({
        title: "Policy Created",
        description: "Cancellation policy has been created successfully.",
      });
      setIsCreating(false);
      setNewPolicy({
        event_id: eventId,
        swig_circuit_id: swigCircuitId,
        days_before_event: 0,
        refund_percentage: 0,
        processing_fee: 0,
        is_active: true
      });
      queryClient.invalidateQueries({ queryKey: ['cancellation-policies'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const [newPolicy, setNewPolicy] = useState<Omit<TicketCancellationPolicy, 'id' | 'created_at'>>({
    event_id: eventId,
    swig_circuit_id: swigCircuitId,
    days_before_event: 0,
    refund_percentage: 0,
    processing_fee: 0,
    is_active: true
  });

  const handleCreatePolicy = () => {
    if (newPolicy.days_before_event < 0 || newPolicy.refund_percentage < 0 || newPolicy.refund_percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Please provide valid values for all fields",
        variant: "destructive",
      });
      return;
    }

    createPolicyMutation.mutate(newPolicy);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading cancellation policies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cancellation Policies</h2>
          <p className="text-muted-foreground">
            Configure refund policies based on cancellation timing
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Cancellation Policy</CardTitle>
            <CardDescription>
              Set refund percentage and fees based on how many days before the event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="days-before">Days Before Event</Label>
                <Input
                  id="days-before"
                  type="number"
                  min="0"
                  value={newPolicy.days_before_event}
                  onChange={(e) => setNewPolicy({ 
                    ...newPolicy, 
                    days_before_event: parseInt(e.target.value) || 0 
                  })}
                  placeholder="e.g., 7"
                />
              </div>
              <div>
                <Label htmlFor="refund-percentage">Refund Percentage (%)</Label>
                <Input
                  id="refund-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={newPolicy.refund_percentage}
                  onChange={(e) => setNewPolicy({ 
                    ...newPolicy, 
                    refund_percentage: parseFloat(e.target.value) || 0 
                  })}
                  placeholder="e.g., 80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="processing-fee">Processing Fee ($)</Label>
              <Input
                id="processing-fee"
                type="number"
                min="0"
                step="0.01"
                value={newPolicy.processing_fee}
                onChange={(e) => setNewPolicy({ 
                  ...newPolicy, 
                  processing_fee: parseFloat(e.target.value) || 0 
                })}
                placeholder="e.g., 5.00"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleCreatePolicy}
                disabled={createPolicyMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createPolicyMutation.isPending ? 'Creating...' : 'Create Policy'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {policy.days_before_event} days before event
                    </h3>
                    {policy.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Refund: {policy.refund_percentage}%</span>
                    <span>Processing Fee: ${policy.processing_fee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Policy editing will be available soon",
                      });
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Policy deletion will be available soon",
                      });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {policies.length === 0 && !isCreating && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No cancellation policies found</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Policy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CancellationPolicyManager;
