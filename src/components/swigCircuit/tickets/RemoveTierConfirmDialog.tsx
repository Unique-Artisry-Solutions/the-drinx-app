
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TicketTier } from '@/hooks/swigCircuit/types';
import { Badge } from '@/components/ui/badge';

interface RemoveTierConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tier?: TicketTier;
}

const RemoveTierConfirmDialog: React.FC<RemoveTierConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tier
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this ticket tier? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {tier && (
          <div className="my-4 p-3 border rounded-md bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{tier.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">${tier.price.toFixed(2)}</span>
                {tier.isVip && <Badge className="bg-amber-500 hover:bg-amber-600">VIP</Badge>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
            {tier.benefits && tier.benefits.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Benefits:</span> {tier.benefits.join(', ')}
              </div>
            )}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTierConfirmDialog;
