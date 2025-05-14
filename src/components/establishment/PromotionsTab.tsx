
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { PlusCircle, X, Clock, FileText, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PromotionForm from './PromotionForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { UserSegmentType } from '@/types/auth/AuthTypes';

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  usage_limit?: number | null;
  usage_count?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: UserSegmentType | null;
  combinable: boolean;
  min_purchase_amount?: number | null;
}

export interface PromotionsTabProps {
  promotions: Promotion[];
  handleAddPromotion: (promotion: Partial<Promotion>) => void;
  handleDeletePromotion: (id: string) => void;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  handleAddPromotion,
  handleDeletePromotion
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreatePromotion = (promotion: Partial<Promotion>) => {
    handleAddPromotion(promotion);
    setIsFormOpen(false);
  };

  const getStatusText = (promo: Promotion) => {
    if (!promo.is_active) return "Inactive";
    if (promo.end_date && new Date(promo.end_date) < new Date()) return "Expired";
    return "Active";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Promotional Offers</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              New Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <div className="p-1">
                <PromotionForm onSubmit={handleCreatePromotion} />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Restrictions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map(promo => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-mono font-medium">{promo.code}</TableCell>
                      <TableCell>{promo.description}</TableCell>
                      <TableCell>
                        {promo.discount_type === 'percentage' ? 'Percentage' : 
                         promo.discount_type === 'fixed' ? 'Fixed Amount' : 'Free Item'}
                      </TableCell>
                      <TableCell>
                        {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : 
                         promo.discount_type === 'fixed' ? `$${promo.discount_value.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.is_active ? "success" : "secondary"}>
                          {getStatusText(promo)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {promo.valid_days && promo.valid_days.length > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock size={12} />
                              Days: {promo.valid_days.length === 7 ? 'All' : promo.valid_days.map(d => d.substring(0, 3)).join(', ')}
                            </Badge>
                          )}
                          {promo.valid_hours && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock size={12} />
                              {promo.valid_hours.start}-{promo.valid_hours.end}
                            </Badge>
                          )}
                          {promo.user_segment && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Tag size={12} />
                              {promo.user_segment === 'new' ? 'New users' : 
                               promo.user_segment === 'returning' ? 'Return users' : 'All users'}
                            </Badge>
                          )}
                          {promo.min_purchase_amount && (
                            <Badge variant={promo.min_purchase_amount > 0 ? "warning" : "default"} className="flex items-center gap-1">
                              <FileText size={12} />
                              Min: ${promo.min_purchase_amount.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePromotion(promo.id)}
                          >
                            <X size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No promotions have been created yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsTab;
