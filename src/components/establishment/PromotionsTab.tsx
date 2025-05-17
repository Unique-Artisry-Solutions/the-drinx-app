
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { PromotionFormData, Promotion } from '@/types/PromotionTypes';

export interface PromotionsTabProps {
  promotions: Promotion[];
  handleAddPromotion: (data: PromotionFormData) => Promise<void>;
  handleDeletePromotion: (id: string) => Promise<void>;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({ 
  promotions, 
  handleAddPromotion, 
  handleDeletePromotion 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);
  
  const handleCreate = async (data: PromotionFormData) => {
    await handleAddPromotion(data);
    closeAddDialog();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Promotion Codes</h2>
        <Button onClick={openAddDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {promotions.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No promotions found. Create your first promotion code!</p>
            </CardContent>
          </Card>
        ) : (
          promotions.map(promotion => (
            <Card key={promotion.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="font-mono">{promotion.code}</CardTitle>
                  <Badge variant={promotion.is_active ? "default" : "outline"}>
                    {promotion.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{promotion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Discount:</span> 
                    {promotion.discount_type === 'percentage' 
                      ? ` ${promotion.discount_value}% off` 
                      : ` $${promotion.discount_value.toFixed(2)} off`}
                  </div>
                  {promotion.usage_limit && (
                    <div>
                      <span className="font-medium">Usage:</span> {promotion.usage_count} / {promotion.usage_limit}
                    </div>
                  )}
                  {promotion.end_date && (
                    <div>
                      <span className="font-medium">Expires:</span> {new Date(promotion.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeletePromotion(promotion.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Add Dialog would go here */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Promotion Code</DialogTitle>
          </DialogHeader>
          <div>
            {/* Promotion form would go here */}
            <Button onClick={closeAddDialog}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsTab;
