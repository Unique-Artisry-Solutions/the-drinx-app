
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clipboard, Share2 } from 'lucide-react';
import { sharePromotionCode } from '@/utils/discountCodeUtils';

interface PromotionCodeShareCardProps {
  code: string;
  description?: string;
  onCopy?: () => void;
}

const PromotionCodeShareCard: React.FC<PromotionCodeShareCardProps> = ({
  code,
  description,
  onCopy,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    if (onCopy) onCopy();
  };

  const handleShare = async (method: 'email' | 'clipboard' | 'social') => {
    await sharePromotionCode(code, method);
    if (method === 'clipboard' && onCopy) onCopy();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="bg-primary/10 rounded-md p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Promo Code</p>
          <p className="text-lg font-mono font-bold">{code}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleShare('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleCopy}
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleShare('social')}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCodeShareCard;
