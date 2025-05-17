
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayOption, DiscountTypeOption, PromotionFormData, PromotionFormProps, dayOptions, discountTypeOptions } from '@/types/PromotionTypes';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PromotionForm: React.FC<PromotionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date(),
    endDate: null,
    validDays: [],
    usageLimit: null,
    isActive: true,
    minPurchaseAmount: null,
    combinable: true
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate || new Date(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const validDays = prev.validDays || [];
      if (validDays.includes(day)) {
        return { ...prev, validDays: validDays.filter(d => d !== day) };
      } else {
        return { ...prev, validDays: [...validDays, day] };
      }
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date }));
      setStartDateOpen(false);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, endDate: date }));
      setEndDateOpen(false);
    }
  };

  const handleClearEndDate = () => {
    setFormData(prev => ({ ...prev, endDate: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">Promo Code</Label>
          <Input 
            id="code" 
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="SUMMER25"
            required
          />
        </div>
        
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="isActive">Status</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
            />
            <Label htmlFor="isActive" className="font-normal">Active</Label>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Summer special discount"
          required
        />
      </div>
      
      {/* Discount Type */}
      <div className="space-y-2">
        <Label>Discount Type</Label>
        <RadioGroup
          value={formData.discountType}
          onValueChange={(value) => handleSelectChange('discountType', value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {discountTypeOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <RadioGroupItem value={option.value} id={`discount-${option.value}`} />
              <div className="grid gap-1">
                <Label htmlFor={`discount-${option.value}`}>{option.label}</Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Discount Value */}
      <div className="space-y-2">
        <Label htmlFor="discountValue">
          {formData.discountType === 'percentage' ? 'Discount Percentage' : 
           formData.discountType === 'fixed' ? 'Discount Amount ($)' : 
           'Discount Value'}
        </Label>
        <Input 
          id="discountValue"
          name="discountValue"
          value={formData.discountValue?.toString() || ''}
          onChange={handleNumberChange}
          type="number"
          required
          min={0}
          max={formData.discountType === 'percentage' ? 100 : undefined}
          step={0.01}
        />
      </div>
      
      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End Date */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="endDate">End Date</Label>
            {formData.endDate && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleClearEndDate}
                className="h-auto py-1 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : <span>No end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate || undefined}
                onSelect={handleEndDateSelect}
                fromDate={new Date(formData.startDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Valid Days */}
      <div className="space-y-2">
        <Label>Valid Days (optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {dayOptions.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={formData.validDays?.includes(day.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) handleDayToggle(day.value);
                  else handleDayToggle(day.value);
                }}
              />
              <Label htmlFor={`day-${day.value}`} className="font-normal">{day.label}</Label>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">If none selected, valid for all days</p>
      </div>
      
      {/* Additional Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
              <Input 
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit?.toString() || ''}
                onChange={handleNumberChange}
                type="number"
                min={0}
                placeholder="Leave empty for unlimited"
              />
            </div>
            
            {/* Min Purchase Amount */}
            <div className="space-y-2">
              <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount (optional)</Label>
              <Input 
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                value={formData.minPurchaseAmount?.toString() || ''}
                onChange={handleNumberChange}
                type="number"
                min={0}
                step={0.01}
                placeholder="Leave empty for no minimum"
              />
            </div>
            
            {/* Combinable */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="combinable"
                checked={formData.combinable}
                onCheckedChange={(checked) => handleCheckboxChange('combinable', checked as boolean)}
              />
              <Label htmlFor="combinable" className="font-normal">
                Combinable with other promotions
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Create'} Promotion
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
