
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash } from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  description: string;
}

interface PromotionsTabProps {
  promotions: Promotion[];
  newPromoCode: string;
  newPromoDescription: string;
  setNewPromoCode: (value: string) => void;
  setNewPromoDescription: (value: string) => void;
  handleAddPromotion: () => void;
  handleDeletePromotion: (id: string) => void;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  newPromoCode,
  newPromoDescription,
  setNewPromoCode,
  setNewPromoDescription,
  handleAddPromotion,
  handleDeletePromotion
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotional Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Promotion Code</label>
            <Input 
              value={newPromoCode} 
              onChange={(e) => setNewPromoCode(e.target.value)}
              placeholder="e.g., SUMMER2023" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={newPromoDescription} 
              onChange={(e) => setNewPromoDescription(e.target.value)}
              placeholder="Describe what this promotion offers" 
              rows={2}
            />
          </div>
          <Button onClick={handleAddPromotion} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Promotion
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium mb-2">Your Promotions</h3>
          {promotions.length > 0 ? (
            promotions.map(promo => (
              <div key={promo.id} className="border rounded-md p-3 flex justify-between items-start">
                <div>
                  <div className="font-medium">{promo.code}</div>
                  <div className="text-sm text-muted-foreground">{promo.description}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeletePromotion(promo.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No promotions added yet. Create your first one!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsTab;
