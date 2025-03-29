
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
    <div className="fixed bottom-20 right-6 z-50 md:bottom-10 md:right-10 animate-fade-in">
      <Button 
        onClick={() => navigate('/checkout')}
        className={cn(
          "flex items-center gap-2 shadow-lg hover:shadow-xl transition-all",
          "bg-spiritless-pink hover:bg-pink-700 text-white rounded-full py-2 px-4"
        )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        <span className="bg-white text-spiritless-pink rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
          {items.length}
        </span>
      </Button>
    </div>
  );
};

export default FloatingCartIndicator;
