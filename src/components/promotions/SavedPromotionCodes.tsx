
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, X, Copy, Calendar } from 'lucide-react';
import { useSavedPromotionCodes } from '@/hooks/useSavedPromotionCodes';

interface SavedPromotionCodesProps {
  userId: string;
}

const SavedPromotionCodes: React.FC<SavedPromotionCodesProps> = ({ userId }) => {
  const { 
    savedCodes, 
    loading, 
    error, 
    fetchSavedCodes, 
    removeSavedCode, 
    copyToClipboard 
  } = useSavedPromotionCodes(userId);

  useEffect(() => {
    fetchSavedCodes();
  }, [fetchSavedCodes]);

  if (loading) {
    return <div className="text-center">Loading saved promotion codes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!savedCodes.length) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You haven't saved any promotion codes yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No expiration';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (type: string, value: number) => {
    let discountType: 'percentage' | 'fixed' | 'free_item' = 'percentage';
    
    // Ensure we map the string type to our valid discount types
    if (type === 'percentage') discountType = 'percentage';
    else if (type === 'fixed') discountType = 'fixed';
    else if (type === 'free_item') discountType = 'free_item';
    
    switch (discountType) {
      case 'percentage':
        return `${value}% off`;
      case 'fixed':
        return `$${value.toFixed(2)} off`;
      case 'free_item':
        return 'Free item';
      default:
        return `${value}% off`;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {savedCodes.map((code) => (
        <Card key={code.id} className="overflow-hidden">
          <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-mono">{code.code}</CardTitle>
                <CardDescription>{code.description}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeSavedCode(code.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Badge>{formatDiscount(code.discount_type, code.discount_value)}</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(code.end_date)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 py-2">
            <div className="flex w-full justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(code.code)}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SavedPromotionCodes;
