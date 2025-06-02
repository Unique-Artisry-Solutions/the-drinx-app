
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RewardModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSave: (reward: any) => void;
  onDelete?: () => void;
  editingReward?: any;
  reward?: any;
  title?: string;
}

const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onSave,
  onDelete,
  editingReward,
  reward,
  title
}) => {
  const isModalOpen = isOpen ?? open ?? false;
  const modalReward = editingReward ?? reward;
  
  const [formData, setFormData] = useState({
    name: modalReward?.name || '',
    description: modalReward?.description || '',
    pointsRequired: modalReward?.pointsRequired || '',
    category: modalReward?.category || 'discount',
    value: modalReward?.value || '',
    expirationDays: modalReward?.expirationDays || '30'
  });

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      pointsRequired: parseInt(formData.pointsRequired),
      value: parseFloat(formData.value),
      expirationDays: parseInt(formData.expirationDays)
    });
    handleClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange || handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {title || (modalReward ? 'Edit Reward' : 'Create New Reward')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Reward Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Free Drink"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the reward..."
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="freeItem">Free Item</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="merchandise">Merchandise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pointsRequired">Points Required</Label>
              <Input
                id="pointsRequired"
                type="number"
                value={formData.pointsRequired}
                onChange={(e) => handleNumberChange('pointsRequired', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => handleNumberChange('value', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expirationDays">Expiration (Days)</Label>
            <Input
              id="expirationDays"
              type="number"
              value={formData.expirationDays}
              onChange={(e) => handleNumberChange('expirationDays', e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">
              {modalReward ? 'Update' : 'Create'} Reward
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
