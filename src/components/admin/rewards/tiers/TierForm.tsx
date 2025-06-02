
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { RewardTier } from '@/lib/rewards/types';

interface TierFormProps {
  tier?: RewardTier;
  onSubmit: (data: Partial<RewardTier>) => void;
  isSubmitting: boolean;
}

export const TierForm = ({ tier, onSubmit, isSubmitting }: TierFormProps) => {
  const [formData, setFormData] = useState<Partial<RewardTier>>({
    name: '',
    description: '',
    points_required: 0,
    benefits: [],
    color: '#4f46e5',
    icon: 'crown',
  });
  const [benefitInputs, setBenefitInputs] = useState<string[]>(['']);

  // Initialize form with tier data if editing
  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name,
        description: tier.description,
        points_required: tier.points_required,
        benefits: tier.benefits,
        color: tier.color || '#4f46e5',
        icon: tier.icon || 'crown',
      });
      
      // Set benefit inputs for editing - handle both string[] and object[] formats
      if (tier.benefits && Array.isArray(tier.benefits) && tier.benefits.length > 0) {
        const benefitStrings = tier.benefits.map((benefit: any) => 
          typeof benefit === 'string' ? benefit : benefit.description || ''
        );
        setBenefitInputs(benefitStrings.length > 0 ? benefitStrings : ['']);
      }
    }
  }, [tier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric input
    if (name === 'points_required') {
      const numValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefitInputs];
    newBenefits[index] = value;
    setBenefitInputs(newBenefits);
  };

  const addBenefit = () => {
    setBenefitInputs([...benefitInputs, '']);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...benefitInputs];
    newBenefits.splice(index, 1);
    setBenefitInputs(newBenefits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the benefits array as simple strings
    const formattedBenefits = benefitInputs
      .filter(benefit => benefit.trim() !== '');
    
    // Submit the form data with formatted benefits
    onSubmit({
      ...formData,
      benefits: formattedBenefits,
      establishment_id: tier?.establishment_id
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="points_required" className="text-right">Points Required</Label>
          <Input
            id="points_required"
            name="points_required"
            type="number"
            min="0"
            value={formData.points_required}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="col-span-3"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="color" className="text-right">Color</Label>
          <div className="flex items-center col-span-3 gap-2">
            <Input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">Benefits</Label>
          <div className="col-span-3 space-y-2">
            {benefitInputs.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeBenefit(index)}
                  disabled={benefitInputs.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addBenefit}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Benefit
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tier ? 'Update Tier' : 'Create Tier'}
        </Button>
      </DialogFooter>
    </form>
  );
};
