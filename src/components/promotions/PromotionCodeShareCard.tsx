
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { sharePromotionCode } from '@/utils/serviceUtils';
import { useToast } from '@/hooks/use-toast';

interface PromotionCodeShareCardProps {
  code: string;
  description: string;
  promotionId: string;
  userId: string;
}

const PromotionCodeShareCard: React.FC<PromotionCodeShareCardProps> = ({
  code,
  description,
  promotionId,
  userId
}) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      const success = await sharePromotionCode(promotionId, userId);
      
      if (success) {
        toast({
          title: "Promotion Shared",
          description: "The promotion code has been shared successfully.",
        });
      } else {
        toast({
          title: "Share Failed",
          description: "There was a problem sharing the promotion code.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sharing promotion:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sharing.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Share Promotion</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Share the "{description}" promotion with your friends and family.
          </p>
          <div className="bg-muted p-3 rounded font-mono text-center">
            {code}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleShare} className="w-full" variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share Promotion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromotionCodeShareCard;
