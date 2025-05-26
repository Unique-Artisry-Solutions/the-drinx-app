
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart, CartItem as CartItemType } from '@/contexts/CartContext';
import { X, Calendar, MapPin, Clock } from 'lucide-react';
import TicketQuantitySelector from '@/components/checkout/TicketQuantitySelector';

interface CartItemProps {
  item: CartItemType;
  showQuantitySelector?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, showQuantitySelector = false }) => {
  const { removeItem, addItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(item.id);
    } else {
      // Update the item with new quantity
      const updatedItem = { ...item, quantity: newQuantity };
      removeItem(item.id);
      addItem(updatedItem);
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'user':
        return 'Individual Plan';
      case 'establishment':
        return 'Establishment Plan';
      case 'event_ticket':
        return 'Event Ticket';
      case 'swig_circuit_ticket':
        return 'Circuit Ticket';
      default:
        return 'Item';
    }
  };

  const getIntervalLabel = (interval: string) => {
    switch (interval) {
      case 'monthly':
        return '/month';
      case 'yearly':
        return '/year';
      case 'one-time':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-start justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm">{item.name}</h4>
            <Badge variant="secondary" className="text-xs mt-1">
              {getItemTypeLabel(item.type)}
            </Badge>
            
            {/* Event/Circuit specific details */}
            {(item.type === 'event_ticket' || item.type === 'swig_circuit_ticket') && (
              <div className="mt-2 space-y-1">
                {item.date && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.date} {item.time && <span className="ml-1">{item.time}</span>}
                  </div>
                )}
                {item.venue && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.venue}
                  </div>
                )}
                {item.ticketName && (
                  <div className="text-xs text-gray-500">
                    Tier: {item.ticketName}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => removeItem(item.id)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quantity selector for applicable items */}
        {showQuantitySelector && (item.type === 'event_ticket' || item.type === 'swig_circuit_ticket') && (
          <div className="mt-3">
            <TicketQuantitySelector
              quantity={item.quantity || 1}
              onQuantityChange={handleQuantityChange}
              maxQuantity={10}
              minQuantity={1}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500">
            {item.quantity && item.quantity > 1 && (
              <span>Qty: {item.quantity} × </span>
            )}
            <span className="font-medium text-gray-900">
              ${item.price.toFixed(2)}{getIntervalLabel(item.interval)}
            </span>
          </div>
          
          {item.quantity && item.quantity > 1 && (
            <div className="text-sm font-medium">
              Total: ${(item.price * item.quantity).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
