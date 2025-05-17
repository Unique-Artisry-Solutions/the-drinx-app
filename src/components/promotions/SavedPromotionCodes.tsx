
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, Trash, RefreshCcw } from 'lucide-react';
import { useSavedPromotionCodes } from '@/hooks/useSavedPromotionCodes';

interface SavedPromotionCodesProps {
  userId: string;
}

const SavedPromotionCodes: React.FC<SavedPromotionCodesProps> = ({ userId }) => {
  const { 
    savedCodes, 
    loading, 
    error, 
    removeSavedCode, 
    copyToClipboard, 
    fetchSavedCodes 
  } = useSavedPromotionCodes(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Promotion Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            Loading saved promotion codes...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Promotion Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 space-y-4">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "Failed to load your saved promotion codes"}
            </p>
            <Button variant="outline" onClick={fetchSavedCodes}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (savedCodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Promotion Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't saved any promotion codes yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved Promotion Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savedCodes.map((promotion) => (
            <div 
              key={promotion.id} 
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
            >
              <div>
                <p className="font-medium">{promotion.code}</p>
                <p className="text-sm text-muted-foreground">{promotion.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(promotion.code)}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSavedCode(promotion.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedPromotionCodes;
