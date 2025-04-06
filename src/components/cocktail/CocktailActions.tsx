
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Clock } from 'lucide-react';

interface CocktailActionsProps {
  liked: boolean;
  onLike: () => void;
  onShare: () => void;
  onOrderedToday: () => void;
}

const CocktailActions: React.FC<CocktailActionsProps> = ({ 
  liked, 
  onLike, 
  onShare, 
  onOrderedToday 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        variant={liked ? "default" : "outline"} 
        onClick={onLike}
        className="gap-2"
      >
        <Heart className={liked ? "fill-white" : ""} size={16} />
        {liked ? "Favorited" : "Add to Favorites"}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onShare}
        className="gap-2"
      >
        <Share2 size={16} />
        Share
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onOrderedToday}
        className="gap-2"
      >
        <Clock size={16} />
        I Had This Today
      </Button>
    </div>
  );
};

export default CocktailActions;
