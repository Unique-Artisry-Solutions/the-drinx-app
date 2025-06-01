
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, MapPin, Calendar } from 'lucide-react';

interface InteractiveElementsProps {
  circuitId: string;
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({ circuitId }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this Swig Circuit!',
        text: 'Join me on this awesome bar crawl circuit!',
        url: window.location.href,
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('Link copied to clipboard!');
          });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          View Map
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
};

export default InteractiveElements;
