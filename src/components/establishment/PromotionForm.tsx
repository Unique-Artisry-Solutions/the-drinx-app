
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ValidDays, UserSegmentType } from '@/types/auth/AuthTypes';

const DAYS_OF_WEEK: ValidDays[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formSchema = z.object({
  code: z.string().min(3, 'Promotion code must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  discount_type: z.enum(['percentage', 'fixed', 'free_item']),
  discount_value: z.union([z.number().min(0), z.string()]).optional(),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  combinable: z.boolean().default(true),
  is_active: z.boolean().default(true),
  usage_limit: z.union([z.number().int().positive(), z.string().optional(), z.null()]).optional(),
  valid_days: z.array(z.string()).optional(),
  valid_hours_start: z.string().optional(),
  valid_hours_end: z.string().optional(),
  user_segment: z.enum(['new', 'returning', 'all']).optional(),
  min_purchase_amount: z.union([z.number().min(0), z.string().optional(), z.null()]).optional(),
});

export interface PromotionFormProps {
  onSubmit: (data: any) => void;
  initialValues?: any;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSubmit, initialValues }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      start_date: new Date().toISOString().split('T')[0],
      combinable: true,
      is_active: true,
      user_segment: 'all'
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Process form values
    const formattedValues = {
      ...values,
      discount_value: typeof values.discount_value === 'string' 
        ? parseFloat(values.discount_value) || 0
        : values.discount_value,
      usage_limit: values.usage_limit 
        ? (typeof values.usage_limit === 'string' ? parseInt(values.usage_limit) : values.usage_limit)
        : null,
      min_purchase_amount: values.min_purchase_amount
        ? (typeof values.min_purchase_amount === 'string' ? parseFloat(values.min_purchase_amount) : values.min_purchase_amount)
        : null,
      valid_days: values.valid_days as ValidDays[] || null,
      valid_hours: (values.valid_hours_start && values.valid_hours_end) 
        ? { start: values.valid_hours_start, end: values.valid_hours_end }
        : null,
      user_segment: values.user_segment as UserSegmentType || null,
    };

    // Remove the extra fields we added for the form
    delete formattedValues.valid_hours_start;
    delete formattedValues.valid_hours_end;

    onSubmit(formattedValues);
  };

  const discountType = form.watch('discount_type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promotion Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER25" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a unique code for this promotion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    <SelectItem value="free_item">Free Item</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose how the discount will be applied
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {discountType !== 'free_item' && (
          <FormField
            control={form.control}
            name="discount_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Discount Value ({discountType === 'percentage' ? '%' : '$'})
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={discountType === 'percentage' ? 100 : undefined}
                    placeholder={discountType === 'percentage' ? '25' : '10.00'}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  {discountType === 'percentage'
                    ? 'Enter percentage discount (0-100)'
                    : 'Enter fixed amount discount'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="25% off on all non-alcoholic drinks"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Clearly describe what this promotion offers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value || ''}
                    min={form.watch('start_date')}
                  />
                </FormControl>
                <FormDescription>
                  Leave blank for no expiration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="usage_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="100"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of redemptions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_purchase_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase Amount (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="25.00"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Minimum amount required to use this promotion
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Valid Days</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <FormField
                key={day}
                control={form.control}
                name="valid_days"
                render={({ field }) => (
                  <FormItem
                    key={day}
                    className="flex flex-row items-center space-x-2 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(day)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, day]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== day)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{day}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valid_hours_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From (Optional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_hours_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until (Optional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="user_segment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target User Segment</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value || 'all'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target users" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users Only</SelectItem>
                  <SelectItem value="returning">Returning Users Only</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Which users can use this promotion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="combinable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-md">
                <div className="space-y-0.5">
                  <FormLabel>Combinable with Other Discounts</FormLabel>
                  <FormDescription>
                    Allow this promotion to be used with others
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-md">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                  <FormDescription>
                    Enable or disable this promotion
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Save Promotion
        </Button>
      </form>
    </Form>
  );
};

export default PromotionForm;
