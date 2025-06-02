import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      variant="outline"
      className="relative"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs font-bold"
          variant={isHovered ? "secondary" : "default"}
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;

