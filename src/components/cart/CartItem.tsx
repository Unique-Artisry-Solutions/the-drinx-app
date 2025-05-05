
import React from 'react';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem } = useCart();

  const renderItemDetails = () => {
    switch (item.type) {
      case 'event_ticket':
        return (
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">
              {item.date} at {item.time}
            </p>
            {item.venue && (
              <p className="text-xs text-gray-500">Venue: {item.venue}</p>
            )}
            {item.quantity && item.quantity > 1 && (
              <p className="text-xs text-purple-600 font-medium">
                Qty: {item.quantity}
              </p>
            )}
          </div>
        );
        
      case 'swig_circuit_ticket':
        return (
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">
              {item.ticketName} {item.date && `• ${item.date}`}
            </p>
            {item.quantity && item.quantity > 1 && (
              <p className="text-xs text-purple-600 font-medium">
                Qty: {item.quantity}
              </p>
            )}
          </div>
        );
        
      default:
        return (
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">
              {item.type === 'user' ? 'User' : 'Establishment'} Plan
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {renderItemDetails()}
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold">
          ${item.price.toFixed(2)}
          {item.interval !== 'one-time' && 
            (item.interval === 'monthly' ? '/mo' : '/yr')
          }
        </p>
        <button 
          onClick={() => removeItem(item.id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
