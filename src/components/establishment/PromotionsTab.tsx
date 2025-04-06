
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash } from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  description: string;
}

interface PromotionsTabProps {
  promotions: Promotion[];
  newPromoCode: string;
  newPromoDescription: string;
  setNewPromoCode: (code: string) => void;
  setNewPromoDescription: (desc: string) => void;
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
        <CardTitle>Promotional Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new promotion form */}
          <div className="bg-background rounded-lg border p-4">
            <h3 className="font-medium mb-3 text-left">Add New Promotion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 text-left block">Promo Code</label>
                <Input
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="e.g. WELCOME10"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 text-left block">Description</label>
                <Textarea
                  value={newPromoDescription}
                  onChange={(e) => setNewPromoDescription(e.target.value)}
                  placeholder="e.g. 10% off for first-time visitors"
                  rows={1}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={handleAddPromotion}>
                  Add Promotion
                </Button>
              </div>
            </div>
          </div>
          
          {/* Current promotions */}
          <div>
            <h3 className="font-medium mb-3 text-left">Active Promotions</h3>
            {promotions.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                No active promotions. Add a new promotion above.
              </p>
            ) : (
              <div className="space-y-3">
                {promotions.map(promo => (
                  <div 
                    key={promo.id} 
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-left">{promo.code}</div>
                      <div className="text-sm text-muted-foreground text-left">{promo.description}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePromotion(promo.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsTab;
