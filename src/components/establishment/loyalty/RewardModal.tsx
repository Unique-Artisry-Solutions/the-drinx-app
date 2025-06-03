
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
  imageUrl?: string;
  expirationDays?: number;
}

interface RewardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reward: any) => void;
  onDelete?: () => void;
  title: string;
  reward?: LoyaltyReward;
}

const defaultReward = {
  name: '',
  description: '',
  pointsRequired: 100,
  isActive: true,
  imageUrl: '',
  expirationDays: 30
};

const RewardModal: React.FC<RewardModalProps> = ({
  open,
  onOpenChange,
  onSave,
  onDelete,
  title,
  reward
}) => {
  const [formData, setFormData] = useState<any>(defaultReward);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (reward) {
      setFormData(reward);
    } else {
      setFormData(defaultReward);
    }
    setIsDeleteConfirm(false);
  }, [reward, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };
  
  const handleToggleActive = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };
  
  const handleSubmit = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 500);
  };
  
  const handleDelete = () => {
    if (isDeleteConfirm && onDelete) {
      onDelete();
    } else {
      setIsDeleteConfirm(true);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Customize reward details that your loyalty program members can redeem.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Reward Name</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter reward name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a clear description of the reward"
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="pointsRequired">Points Required</Label>
            <Input 
              id="pointsRequired" 
              name="pointsRequired"
              type="number"
              value={formData.pointsRequired}
              onChange={handleNumberChange}
              min={1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="expirationDays">Expiration Days</Label>
            <Input 
              id="expirationDays" 
              name="expirationDays"
              type="number"
              value={formData.expirationDays || ''}
              onChange={handleNumberChange}
              min={0}
              placeholder="Leave empty for no expiration"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Number of days until reward expires after redemption. 0 for no expiration.</p>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleToggleActive}
            />
          </div>
          
          {isDeleteConfirm && onDelete && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Are you sure you want to delete this reward? This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSaving}
              >
                {isDeleteConfirm ? 'Confirm Delete' : 'Delete'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
