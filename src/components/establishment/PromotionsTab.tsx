
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, Trash, UserCheck, DollarSign } from 'lucide-react';
import { Promotion } from '@/types/SupabaseTables';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PromotionForm from './PromotionForm';
import { PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';

interface PromotionsTabProps {
  promotions: Promotion[];
  handleAddPromotion: (data: PromotionFormData) => Promise<void>;
  handleUpdatePromotion: (id: string, data: PromotionFormData) => Promise<void>;
  handleDeletePromotion: (id: string) => void;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  handleAddPromotion,
  handleUpdatePromotion,
  handleDeletePromotion
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const onEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
  };
  
  const onCloseEditDialog = () => {
    setEditingPromotion(null);
  };

  const formatDiscountValue = (promotion: Promotion) => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}%`;
    } else if (promotion.discount_type === 'fixed') {
      return `$${promotion.discount_value}`;
    } else {
      return 'Free Item';
    }
  };

  // Format day restriction for display
  const formatDayRestriction = (days: string[] | null | undefined) => {
    if (!days || days.length === 0) return 'Every day';
    if (days.length === 7) return 'Every day';
    
    // Show specific days
    if (days.length <= 3) {
      return days.map(day => day.slice(0, 3)).join(', ');
    } else {
      // If more than 3 days are selected, show count
      return `${days.length} days/week`;
    }
  };

  // Format time restriction for display
  const formatTimeRestriction = (hours: { start: string; end: string } | null | undefined) => {
    if (!hours || !hours.start || !hours.end) return 'All hours';
    
    // Convert to 12-hour time format
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, '0')}${period}`;
    };
    
    return `${formatTime(hours.start)} - ${formatTime(hours.end)}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Promotional Offers</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add Promotion
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {promotions.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
              <Tag className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                No active promotions. Create your first promotion to attract new customers.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                Create Promotion
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map(promo => (
                <Card key={promo.id} className="overflow-hidden">
                  <div className={`p-4 border-b ${promo.is_active ? 'bg-green-50' : 'bg-muted/30'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{promo.code}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {promo.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={promo.is_active ? "success" : "secondary"}>
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={promo.discount_type === 'percentage' ? 'warning' : 'default'}>
                          {formatDiscountValue(promo)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <TooltipProvider>
                        {/* Date Range */}
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {format(new Date(promo.start_date), 'MMM d, yyyy')}
                            {promo.end_date && ` - ${format(new Date(promo.end_date), 'MMM d, yyyy')}`}
                          </span>
                        </div>
                        
                        {/* Usage */}
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>
                            Used {promo.usage_count || 0} time{promo.usage_count !== 1 ? 's' : ''}
                            {promo.usage_limit && ` of ${promo.usage_limit}`}
                          </span>
                        </div>
                        
                        {/* Day restrictions */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDayRestriction(promo.valid_days)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {promo.valid_days?.length ? (
                              <div>Valid on: {promo.valid_days.join(', ')}</div>
                            ) : (
                              <div>Valid every day</div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                        
                        {/* Time restrictions */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatTimeRestriction(promo.valid_hours)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {promo.valid_hours?.start && promo.valid_hours?.end ? (
                              <div>Valid from {promo.valid_hours.start} to {promo.valid_hours.end}</div>
                            ) : (
                              <div>Valid all hours</div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                        
                        {/* User segment */}
                        {promo.user_segment && promo.user_segment !== 'all' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <UserCheck className="h-3 w-3 mr-1" />
                                <span>
                                  {promo.user_segment === 'new' ? 'New users only' : 'Returning users only'}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {promo.user_segment === 'new' 
                                ? 'Only for customers who have never visited before'
                                : 'Only for customers who have visited before'
                              }
                            </TooltipContent>
                          </Tooltip>
                        )}
                        
                        {/* Min purchase */}
                        {promo.min_purchase_amount && (
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>Min. purchase: ${promo.min_purchase_amount}</span>
                          </div>
                        )}
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="p-3 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditPromotion(promo)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive" 
                      onClick={() => handleDeletePromotion(promo.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Promotion Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <PromotionForm 
              onSubmit={handleAddPromotion}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Promotion Dialog */}
        <Dialog open={!!editingPromotion} onOpenChange={() => setEditingPromotion(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Promotion</DialogTitle>
            </DialogHeader>
            {editingPromotion && (
              <PromotionForm 
                promotion={editingPromotion}
                onSubmit={(data) => handleUpdatePromotion(editingPromotion.id, data)}
                onCancel={onCloseEditDialog}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PromotionsTab;
