import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface TicketType {
  id?: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  hasLimitedInventory?: boolean;
  lowInventoryThreshold?: number;
  hasDynamicPricing?: boolean;
}

interface TicketingStepProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

const TicketingStep: React.FC<TicketingStepProps> = ({ onDataChange, initialData }) => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  useEffect(() => {
    if (initialData && initialData.ticketTypes) {
      setTicketTypes(initialData.ticketTypes);
    }
  }, [initialData]);

  useEffect(() => {
    onDataChange({ ticketTypes });
  }, [ticketTypes, onDataChange]);

  const addTicket = () => {
    const newTicket: TicketType = {
      name: '',
      price: 0,
      description: '',
      quantity: 100,
      hasLimitedInventory: false,
      hasDynamicPricing: false
    };
    setTicketTypes([...ticketTypes, newTicket]);
  };

  const updateTicket = (index: number, field: string, value: any) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes[index][field] = value;
    setTicketTypes(updatedTicketTypes);
  };

  const deleteTicket = (index: number) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes.splice(index, 1);
    setTicketTypes(updatedTicketTypes);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(ticketTypes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTicketTypes(items);
  };

  const handleLimitedInventoryChange = (index: number, checked: boolean) => {
    updateTicket(index, 'hasLimitedInventory', checked);
  };

  const handleDynamicPricingChange = (index: number, checked: boolean) => {
    updateTicket(index, 'hasDynamicPricing', checked);
  };

  const handleLowInventoryThresholdChange = (index: number, value: number) => {
    updateTicket(index, 'lowInventoryThreshold', value);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tickets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <Draggable key={ticket.id || index.toString()} draggableId={ticket.id || index.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div {...provided.dragHandleProps} className="cursor-grab mr-2">
                            <GripVertical className="h-5 w-5 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold">Ticket Type {index + 1}</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteTicket(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Name</Label>
                          <Input
                            type="text"
                            id={`name-${index}`}
                            placeholder="General Admission"
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`price-${index}`}>Price</Label>
                          <Input
                            type="number"
                            id={`price-${index}`}
                            placeholder="25.00"
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, 'price', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Access to the main event area"
                          rows={3}
                          value={ticket.description}
                          onChange={(e) => updateTicket(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          type="number"
                          id={`quantity-${index}`}
                          placeholder="100"
                          value={ticket.quantity}
                          onChange={(e) => updateTicket(index, 'quantity', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`limited-inventory-${index}`}
                            checked={ticket.hasLimitedInventory || false}
                            onCheckedChange={(checked) => handleLimitedInventoryChange(index, checked)}
                          />
                          <Label htmlFor={`limited-inventory-${index}`}>Limited Inventory</Label>
                        </div>

                        {ticket.hasLimitedInventory && (
                          <div className="w-40">
                            <Label htmlFor={`low-inventory-threshold-${index}`} className="text-sm">Low Inventory Threshold</Label>
                            <Slider
                              id={`low-inventory-threshold-${index}`}
                              defaultValue={[ticket.lowInventoryThreshold || 10]}
                              max={ticket.quantity}
                              step={1}
                              onValueChange={(value) => handleLowInventoryThresholdChange(index, value[0])}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Threshold: {ticket.lowInventoryThreshold}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`dynamic-pricing-${index}`}
                          checked={ticket.hasDynamicPricing || false}
                          onCheckedChange={(checked) => handleDynamicPricingChange(index, checked)}
                        />
                        <Label htmlFor={`dynamic-pricing-${index}`}>Dynamic Pricing</Label>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button onClick={addTicket}>Add Ticket Type</Button>
    </div>
  );
};

export default TicketingStep;
