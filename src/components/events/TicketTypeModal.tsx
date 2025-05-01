
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EventTicketType } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';

interface TicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticketType: Omit<EventTicketType, 'id' | 'sold' | 'available'>) => Promise<void>;
  ticketType?: EventTicketType;
  isEditing?: boolean;
}

const initialState: Omit<EventTicketType, 'id' | 'sold' | 'available'> = {
  name: '',
  description: '',
  price: 0,
  quantity: 100,
};

const TicketTypeModal: React.FC<TicketTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ticketType,
  isEditing = false
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Omit<EventTicketType, 'id' | 'sold' | 'available'>>(
    ticketType ? {
      name: ticketType.name,
      description: ticketType.description,
      price: ticketType.price,
      quantity: ticketType.quantity
    } : initialState
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when the modal opens/closes or ticket type changes
  React.useEffect(() => {
    if (ticketType) {
      setFormData({
        name: ticketType.name,
        description: ticketType.description,
        price: ticketType.price,
        quantity: ticketType.quantity
      });
    } else {
      setFormData(initialState);
    }
  }, [ticketType, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast({
        title: isEditing ? 'Ticket Type Updated' : 'Ticket Type Created',
        description: `Ticket type has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} ticket type.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Ticket Type' : 'New Ticket Type'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ticket Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleNumberChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketTypeModal;
