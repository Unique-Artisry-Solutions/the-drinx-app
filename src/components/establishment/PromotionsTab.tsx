import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from '@/components/icons/PlusCircle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Promotion, PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';

interface PromotionsTabProps {
  promotions: Promotion[];
  handleAddPromotion: (data: PromotionFormData) => Promise<void>;
  handleUpdatePromotion: (id: string, data: PromotionFormData) => Promise<void>;
  handleDeletePromotion: (id: string) => Promise<void>;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  handleAddPromotion,
  handleUpdatePromotion,
  handleDeletePromotion
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Promotions</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Promotion
        </Button>
      </div>
      
      {promotions.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p>No promotions found. Create your first promotion to attract customers!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className={!promotion.is_active ? "opacity-60" : undefined}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{promotion.code}</CardTitle>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${promotion.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {promotion.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {promotion.discount_type === 'percentage' 
                    ? `${promotion.discount_value}% off` 
                    : promotion.discount_type === 'fixed' 
                      ? `$${promotion.discount_value} off`
                      : 'Free item'}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{promotion.description}</p>
                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {promotion.end_date 
                      ? `Expires: ${new Date(promotion.end_date).toLocaleDateString()}`
                      : 'No expiration'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeletePromotion(promotion.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Promotion</DialogTitle>
          </DialogHeader>
          <p>Promotion form would go here (not implemented in this fix)</p>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsTab;
