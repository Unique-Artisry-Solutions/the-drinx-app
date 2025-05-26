
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketInventory } from '@/types/TicketManagementTypes';
import { Plus, Edit, AlertTriangle } from 'lucide-react';

interface TicketInventoryManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const TicketInventoryManager: React.FC<TicketInventoryManagerProps> = ({ 
  eventId, 
  swigCircuitId 
}) => {
  const { inventory, inventoryLoading } = useTicketManagement();
  const [editingInventory, setEditingInventory] = useState<TicketInventory | null>(null);

  const filteredInventory = inventory?.filter(item => 
    (eventId && item.event_id === eventId) ||
    (swigCircuitId && item.swig_circuit_id === swigCircuitId)
  ) || [];

  const getAvailabilityStatus = (item: TicketInventory) => {
    const percentage = (item.available_quantity / item.total_quantity) * 100;
    if (percentage === 0) return { status: 'sold-out', color: 'destructive' };
    if (percentage < 10) return { status: 'low-stock', color: 'secondary' };
    return { status: 'available', color: 'default' };
  };

  if (inventoryLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Inventory</h2>
          <p className="text-muted-foreground">
            Manage ticket availability and track sales
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Ticket Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const { status, color } = getAvailabilityStatus(item);
          
          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.ticket_type_id || 'General Admission'}</CardTitle>
                  <Badge variant={color as any}>
                    {status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Total</Label>
                    <p className="font-semibold">{item.total_quantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sold</Label>
                    <p className="font-semibold">{item.sold_quantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reserved</Label>
                    <p className="font-semibold">{item.reserved_quantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Available</Label>
                    <p className="font-semibold text-green-600">{item.available_quantity}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(item.last_updated).toLocaleDateString()}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingInventory(item)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>

                {item.available_quantity < 10 && item.available_quantity > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs text-yellow-700">Low stock warning</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No ticket inventory found. Add ticket types to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketInventoryManager;
