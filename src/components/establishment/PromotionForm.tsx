
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { promotionFormSchema } from '@/lib/validations/promotionSchema';
import { PromotionFormProps, PromotionFormData, dayOptions, discountTypeOptions } from '@/types/PromotionTypes';
import { Checkbox } from '@/components/ui/checkbox';

const PromotionForm: React.FC<PromotionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}) => {
  const defaultValues: Partial<PromotionFormData> = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: new Date(),
    endDate: null,
    validDays: [],
    usageLimit: null,
    isActive: true,
    minPurchaseAmount: null,
    combinable: true,
    ...initialData
  };

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors, isSubmitting },
    watch
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues
  });

  const discountType = watch('discountType');

  const handleFormSubmit = async (data: PromotionFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Code & Active Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Promotion Code</Label>
          <Input
            id="code"
            placeholder="SUMMER2025"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-8">
          <Switch id="isActive" {...register('isActive')} />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Summer special discount"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <Label>Discount Type</Label>
        <Controller
          control={control}
          name="discountType"
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              className="flex flex-col space-y-3"
            >
              {discountTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-normal">
                    {option.label} - {option.description}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
        {errors.discountType && (
          <p className="text-sm text-red-500">{errors.discountType.message}</p>
        )}
      </div>

      {/* Discount Value */}
      <div className="space-y-2">
        <Label htmlFor="discountValue">
          {discountType === 'percentage' 
            ? 'Discount Percentage (%)' 
            : discountType === 'fixed'
              ? 'Discount Amount ($)'
              : 'Item Value ($)'}
        </Label>
        <Input
          id="discountValue"
          type="number"
          min={0}
          max={discountType === 'percentage' ? 100 : undefined}
          step="0.01"
          {...register('discountValue', { valueAsNumber: true })}
        />
        {errors.discountValue && (
          <p className="text-sm text-red-500">{errors.discountValue.message}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value || undefined}
                onSelect={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Valid Days */}
      <div className="space-y-4">
        <div>
          <Label>Valid Days (Optional)</Label>
          <p className="text-sm text-muted-foreground">
            If none selected, the promotion is valid every day
          </p>
        </div>
        <Controller
          control={control}
          name="validDays"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dayOptions.map((day) => {
                const isSelected = field.value?.includes(day.value) || false;
                return (
                  <div 
                    key={day.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`day-${day.value}`} 
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), day.value]);
                        } else {
                          field.onChange(field.value?.filter(v => v !== day.value));
                        }
                      }}
                    />
                    <Label htmlFor={`day-${day.value}`} className="font-normal">
                      {day.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Usage Limit */}
      <div className="space-y-2">
        <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
        <Input
          id="usageLimit"
          type="number"
          min={1}
          placeholder="Unlimited"
          {...register('usageLimit', { 
            valueAsNumber: true,
            setValueAs: v => v === '' ? null : parseInt(v, 10)
          })}
        />
        {errors.usageLimit && (
          <p className="text-sm text-red-500">{errors.usageLimit.message}</p>
        )}
      </div>

      {/* Min Purchase Amount */}
      <div className="space-y-2">
        <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount (Optional)</Label>
        <Input
          id="minPurchaseAmount"
          type="number"
          min={0}
          step="0.01"
          placeholder="No minimum"
          {...register('minPurchaseAmount', { 
            valueAsNumber: true,
            setValueAs: v => v === '' ? null : parseFloat(v)
          })}
        />
        {errors.minPurchaseAmount && (
          <p className="text-sm text-red-500">{errors.minPurchaseAmount.message}</p>
        )}
      </div>

      {/* Combinable with Other Promotions */}
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="combinable"
          render={({ field }) => (
            <Switch
              id="combinable"
              checked={field.value === true}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="combinable">
          Can be combined with other promotions
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Update' : 'Create'} Promotion
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
