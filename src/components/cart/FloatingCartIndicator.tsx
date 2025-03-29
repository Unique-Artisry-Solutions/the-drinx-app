
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FloatingCartIndicator: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { items, totalPrice } = useCart();
  
  // Don't render if cart is empty
  if (items.length === 0) return null;
  
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-spiritless-pink hover:bg-spiritless-pink/90 text-white rounded-full shadow-lg flex items-center gap-2"
      size="lg"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        <Badge 
          className="absolute -top-2 -right-2 bg-white text-spiritless-pink h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {items.length}
        </Badge>
      </div>
      <span>${totalPrice.toFixed(2)}</span>
    </Button>
  );
};

export default FloatingCartIndicator;
