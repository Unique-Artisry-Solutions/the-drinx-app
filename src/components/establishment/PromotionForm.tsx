
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { promotionFormSchema, PromotionFormValues } from '@/lib/validations/promotionSchema';
import { PromotionFormProps, dayOptions, discountTypeOptions } from '@/types/PromotionTypes';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

const PromotionForm: React.FC<PromotionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialData?.startDate || new Date(),
    to: initialData?.endDate || undefined
  });

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      code: initialData?.code || '',
      description: initialData?.description || '',
      discountType: initialData?.discountType || 'percentage',
      discountValue: initialData?.discountValue || 10,
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || null,
      validDays: initialData?.validDays || [],
      usageLimit: initialData?.usageLimit || null,
      isActive: initialData?.isActive ?? true,
      minPurchaseAmount: initialData?.minPurchaseAmount || null,
      combinable: initialData?.combinable ?? true
    }
  });

  const handleFormSubmit = (data: PromotionFormValues) => {
    const formData = {
      ...data,
      startDate: dateRange?.from || new Date(),
      endDate: dateRange?.to || null,
    };
    
    onSubmit(formData);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      form.setValue('startDate', range.from);
      form.setValue('endDate', range.to || null);
    }
  };

  const discountType = form.watch('discountType');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Promotion' : 'Create Promotion'}</CardTitle>
        <p className="text-muted-foreground text-sm">
          {isEditing ? 'Update promotion details' : 'Set up a new promotion for your establishment'}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="SUMMER25" 
                        {...field} 
                        disabled={isEditing}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable this promotion immediately
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Summer season promotion with 25% off all mocktails" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {discountTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - {option.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          max={discountType === 'percentage' ? 100 : undefined}
                          placeholder={discountType === 'percentage' ? '25' : '10'}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {discountType === 'percentage' ? '%' : '$'}
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {discountType === 'percentage'
                        ? 'Enter percentage discount (0-100)'
                        : discountType === 'fixed'
                        ? 'Enter fixed amount discount'
                        : 'Enter minimum purchase for free item'}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Promotion Period</label>
              <DatePickerWithRange dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
            </div>

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Leave blank for unlimited use
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="combinable"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Combinable with other promotions</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Allow this promotion to be used alongside others
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Promotion' : 'Create Promotion'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;
