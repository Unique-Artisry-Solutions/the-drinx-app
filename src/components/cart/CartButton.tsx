
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Cart from './Cart';
import { cn } from '@/lib/utils';
import { formatCartCount } from '@/utils/formatters';

const CartButton: React.FC = () => {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  
  const itemCount = items.length;
  const hasItems = itemCount > 0;
  const displayCount = formatCartCount(itemCount);
  
  // Add animation effect when items change
  useEffect(() => {
    if (itemCount > 0) {
      setIsNewItem(true);
      const timer = setTimeout(() => setIsNewItem(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <div className="cart-button-wrapper">
      {/* Container with no overflow constraints */}
      <div className="relative inline-block">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCartOpen(true)}
          className="relative"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        
        {/* Badge positioned absolutely relative to wrapper, not button */}
        {hasItems && (
          <div 
            className={cn(
              "absolute -top-2 -right-2",
              "pointer-events-none", // Let clicks pass through to button
              "z-[100]" // Even higher z-index to overcome any stacking context issues
            )}
          >
            <div
              className={cn(
                "bg-spiritless-pink text-white",
                "h-6 w-6 min-w-6",
                "flex items-center justify-center",
                "text-xs font-bold",
                "rounded-full",
                "border-2 border-white",
                "shadow-md",
                "transform-gpu", // Use GPU for smoother animations
                isNewItem ? "cart-badge-pulse" : ""
              )}
            >
              {displayCount}
            </div>
          </div>
        )}
      </div>
      
      {/* Cart dialog */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default CartButton;
