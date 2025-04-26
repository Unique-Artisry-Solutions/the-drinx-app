import React from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash, Plus } from 'lucide-react';
const TicketingStep: React.FC = () => {
  const {
    formData,
    updateFormData
  } = useEventWizard();
  const handleTicketChange = (index: number, field: string, value: string | number) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value
    };
    updateFormData({
      ticketTypes: updatedTickets
    });
  };
  const addTicketType = () => {
    const newTicket = {
      name: `Ticket Type ${formData.ticketTypes.length + 1}`,
      price: 0,
      description: '',
      quantity: 50
    };
    updateFormData({
      ticketTypes: [...formData.ticketTypes, newTicket]
    });
  };
  const removeTicketType = (index: number) => {
    const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index);
    updateFormData({
      ticketTypes: updatedTickets
    });
  };
  return <Card className="shadow-md">
      <CardContent className="pt-6 my-px">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Ticket Types</h3>
            <Button onClick={addTicketType} variant="outline" size="sm" className="text-purple-600 border-purple-600 hover:bg-purple-50">
              <Plus className="h-4 w-4 mr-2" />
              Add Ticket Type
            </Button>
          </div>

          {formData.ticketTypes.map((ticket, index) => <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Ticket Type {index + 1}</h4>
                {formData.ticketTypes.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeTicketType(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash className="h-4 w-4" />
                  </Button>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`ticket-name-${index}`}>Name</Label>
                <Input id={`ticket-name-${index}`} value={ticket.name} onChange={e => handleTicketChange(index, 'name', e.target.value)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`ticket-price-${index}`}>Price ($)</Label>
                  <Input id={`ticket-price-${index}`} type="number" min="0" step="0.01" value={ticket.price} onChange={e => handleTicketChange(index, 'price', e.target.value)} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`ticket-quantity-${index}`}>Quantity</Label>
                  <Input id={`ticket-quantity-${index}`} type="number" min="1" value={ticket.quantity} onChange={e => handleTicketChange(index, 'quantity', e.target.value)} />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`ticket-description-${index}`}>Description</Label>
                <Textarea id={`ticket-description-${index}`} value={ticket.description} onChange={e => handleTicketChange(index, 'description', e.target.value)} placeholder="What does this ticket include?" rows={2} />
              </div>
            </div>)}
          
          {formData.ticketTypes.length === 0 && <p className="text-center py-8 text-gray-500">
              No ticket types added. Click the button above to add a ticket type.
            </p>}
        </div>
      </CardContent>
    </Card>;
};
export default TicketingStep;