
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FloatingCartIndicator: React.FC = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] md:right-10 md:bottom-10">
      <Button 
        onClick={() => navigate('/checkout')}
        className={cn(
          "shadow-lg",
          "bg-red-500 hover:bg-red-600 text-white rounded-full py-3 px-4",
          "flex items-center gap-2"
        )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-medium">${totalPrice.toFixed(2)}</span>
        <div className="bg-white text-red-500 rounded-full h-5 w-5 flex items-center justify-center">
          {items.length}
        </div>
      </Button>
    </div>
  );
};

export default FloatingCartIndicator;
