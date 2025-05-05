
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Cart from './Cart';
import { Badge } from '@/components/ui/badge';

const CartButton: React.FC = () => {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 bg-spiritless-pink text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full z-20 border border-white shadow-sm transition-all duration-200 scale-100 animate-fade-in"
          >
            {items.length}
          </Badge>
        )}
      </Button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;
