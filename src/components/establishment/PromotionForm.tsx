
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { PromotionFormData } from '@/types/PromotionTypes';

interface PromotionFormProps {
  onSubmit: (formData: PromotionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<PromotionFormData>;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    start_date: new Date(),
    end_date: null,
    valid_days: [],
    usage_limit: null,
    is_active: true,
    min_purchase_amount: null,
    combinable: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof PromotionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium">Promotion Code</label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="Enter promotion code"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="discount_type" className="block text-sm font-medium">Discount Type</label>
          <Select 
            value={formData.discount_type} 
            onValueChange={(value: 'percentage' | 'fixed' | 'free_item') => handleChange('discount_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
              <SelectItem value="free_item">Free Item</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="discount_value" className="block text-sm font-medium">Discount Value</label>
          <Input
            id="discount_value"
            type="number"
            min={0}
            value={formData.discount_value || ''}
            onChange={(e) => handleChange('discount_value', parseFloat(e.target.value))}
            placeholder={formData.discount_type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="usage_limit" className="block text-sm font-medium">Usage Limit</label>
          <Input
            id="usage_limit"
            type="number"
            min={0}
            value={formData.usage_limit || ''}
            onChange={(e) => handleChange('usage_limit', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Leave empty for unlimited"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="min_purchase_amount" className="block text-sm font-medium">Min Purchase Amount</label>
          <Input
            id="min_purchase_amount"
            type="number"
            min={0}
            step={0.01}
            value={formData.min_purchase_amount || ''}
            onChange={(e) => handleChange('min_purchase_amount', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Leave empty for no minimum"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Active Status</label>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={formData.is_active} 
              onCheckedChange={(checked) => handleChange('is_active', checked)} 
            />
            <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Start Date</label>
          <DatePicker 
            date={formData.start_date ? new Date(formData.start_date) : undefined} 
            setDate={(date) => handleChange('start_date', date)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">End Date</label>
          <DatePicker 
            date={formData.end_date ? new Date(formData.end_date) : undefined} 
            setDate={(date) => handleChange('end_date', date)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Can be combined with other promotions?</label>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={formData.combinable} 
              onCheckedChange={(checked) => handleChange('combinable', checked)} 
            />
            <span>{formData.combinable ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the promotion"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Promotion
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
