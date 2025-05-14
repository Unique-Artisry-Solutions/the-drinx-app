
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Facebook, Twitter, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { sharePromotionCode } from '@/utils/discountCodeUtils';
import { format } from 'date-fns';

interface PromotionCodeShareCardProps {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  expiryDate?: string | null;
  onSave?: () => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

const PromotionCodeShareCard: React.FC<PromotionCodeShareCardProps> = ({
  code,
  description,
  discountType,
  discountValue,
  expiryDate,
  onSave,
  isSaved,
  showSaveButton = true
}) => {
  const { toast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Code copied',
      description: 'Promotion code copied to clipboard',
    });
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'email') => {
    sharePromotionCode(code, platform, description);
    setIsShareOpen(false);
  };

  const formatDiscountValue = () => {
    if (discountType === 'percentage') {
      return `${discountValue}% off`;
    } else if (discountType === 'fixed') {
      return `$${discountValue.toFixed(2)} off`;
    } else {
      return 'Free item';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{code}</CardTitle>
            <CardDescription>
              {description || `${formatDiscountValue()} promotion`}
            </CardDescription>
          </div>
          <Badge variant={discountType === 'percentage' ? 'default' : 'outline'} className="ml-2">
            {formatDiscountValue()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {expiryDate && (
          <p className="text-sm text-gray-500 mb-2">
            Valid until {format(new Date(expiryDate), 'MMM dd, yyyy')}
          </p>
        )}
        
        {isShareOpen ? (
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-medium">Share this code:</h4>
            <div className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 mr-2"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      Facebook
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share on Facebook</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 mx-1"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      Twitter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share on Twitter</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 ml-2"
                      onClick={() => handleShare('email')}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share via Email</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="flex items-center justify-center w-full"
              size="sm"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/20 flex justify-between pt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsShareOpen(!isShareOpen)}
          className="flex-1 mr-2"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isShareOpen ? 'Hide Options' : 'Share'}
        </Button>
        
        {showSaveButton && onSave && (
          <Button
            variant={isSaved ? "outline" : "default"}
            size="sm"
            onClick={onSave}
            className="flex-1 ml-2"
          >
            {isSaved ? "Saved" : "Save Code"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PromotionCodeShareCard;
