
import React from 'react';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-600">
          {item.type === 'user' ? 'User' : 'Establishment'} Plan
        </p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold">${item.price}{item.interval === 'monthly' ? '/mo' : '/yr'}</p>
        <button 
          onClick={() => removeItem(item.id)}
          className="text-gray-500 hover:text-red-500"
          aria-label="Remove item"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
