
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Cart from './Cart';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CartButton: React.FC = () => {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const itemCount = items.length;
  const hasItems = itemCount > 0;

  return (
    <>
      <div className="relative inline-block">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCartOpen(true)}
          className="relative"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          
          {hasItems && (
            <Badge 
              className={cn(
                "absolute -top-2 -right-2",
                "bg-spiritless-pink text-white",
                "h-6 w-6 min-w-6", // Slightly larger for better visibility
                "flex items-center justify-center p-0",
                "text-xs font-bold",
                "rounded-full",
                "z-50", // Very high z-index to ensure visibility
                "border-2 border-white", // Thicker border
                "shadow-md", // More pronounced shadow
                "transition-all duration-300",
                "scale-100 origin-center",
                "animate-[pulse_2s_ease-in-out_1]" // Pulse animation when first seen
              )}
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;
