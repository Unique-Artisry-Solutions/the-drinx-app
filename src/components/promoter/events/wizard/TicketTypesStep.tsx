
import React from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash } from 'lucide-react';

const TicketTypesStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();
  
  const addTicketType = () => {
    const newTicketTypes = [...(formData.ticketTypes || []), {
      name: '',
      price: 0,
      description: '',
      quantity: 100
    }];
    updateFormData({ ticketTypes: newTicketTypes });
  };

  const removeTicketType = (index: number) => {
    const newTicketTypes = (formData.ticketTypes || []).filter((_, i) => i !== index);
    updateFormData({ ticketTypes: newTicketTypes });
  };
  
  const updateTicketType = (index: number, field: string, value: string | number) => {
    const newTicketTypes = [...(formData.ticketTypes || [])];
    newTicketTypes[index] = {
      ...newTicketTypes[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value
    };
    updateFormData({ ticketTypes: newTicketTypes });
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Ticket Types</h3>
          <Button 
            onClick={addTicketType} 
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Ticket Type
          </Button>
        </div>
        
        {!formData.ticketTypes || formData.ticketTypes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500">No ticket types added yet. Click the button above to add your first ticket type.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 border rounded-md relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeTicketType(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`ticket-name-${index}`}>Ticket Name</Label>
                    <Input
                      id={`ticket-name-${index}`}
                      value={ticket.name}
                      onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                      placeholder="e.g., General Admission"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-price-${index}`}>Price ($)</Label>
                    <Input
                      id={`ticket-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`ticket-description-${index}`}>Description (Optional)</Label>
                    <Textarea
                      id={`ticket-description-${index}`}
                      value={ticket.description || ''}
                      onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                      placeholder="Describe what this ticket includes"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`ticket-quantity-${index}`}>Quantity Available</Label>
                    <Input
                      id={`ticket-quantity-${index}`}
                      type="number"
                      min="1"
                      value={ticket.quantity || 100}
                      onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketTypesStep;
