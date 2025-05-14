
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Promotion } from '@/types/SupabaseTables';
import { PromotionFormData } from '@/hooks/establishment/useEstablishmentPromotions';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { TimePicker } from '@/components/ui/time-picker'; // Assumes this component exists

// Define valid days of the week
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const;

// Define valid user segments
const USER_SEGMENTS = [
  { label: 'All Users', value: 'all' },
  { label: 'New Customers Only', value: 'new' },
  { label: 'Returning Customers Only', value: 'returning' }
];

// Define validation schema
const promotionSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  discount_type: z.enum(['percentage', 'fixed', 'free_item']),
  discount_value: z.number().nullable().superRefine((val, ctx) => {
    if (['percentage', 'fixed'].includes(ctx.path[0]) && (val === null || val <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify a valid discount value'
      });
    }
  }),
  start_date: z.string(),
  end_date: z.string().optional(),
  min_purchase: z.number().optional(),
  max_discount: z.number().optional(),
  usage_limit: z.number().int().optional(),
  
  // Advanced rules
  valid_days: z.array(z.string()).optional(),
  valid_hours: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  user_segment: z.string().optional(),
  combinable: z.boolean().optional(),
  min_purchase_amount: z.number().optional()
});

interface PromotionFormProps {
  promotion?: Promotion;
  onSubmit: (data: PromotionFormData) => Promise<void>;
  onCancel: () => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  onSubmit,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Initialize form with existing promotion data or defaults
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: promotion?.code || '',
      description: promotion?.description || '',
      discount_type: promotion?.discount_type || 'percentage',
      discount_value: promotion?.discount_value || null,
      start_date: promotion?.start_date || new Date().toISOString(),
      end_date: promotion?.end_date || undefined,
      min_purchase: promotion?.min_purchase || undefined,
      max_discount: promotion?.max_discount || undefined,
      usage_limit: promotion?.usage_limit || undefined,
      
      // Advanced rules
      valid_days: promotion?.valid_days || [],
      valid_hours: promotion?.valid_hours || undefined,
      user_segment: promotion?.user_segment || 'all',
      combinable: promotion?.combinable !== false,
      min_purchase_amount: promotion?.min_purchase_amount || undefined
    }
  });

  const handleSubmit = async (data: PromotionFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage Discount (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' },
    { value: 'free_item', label: 'Free Item' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Basic promotion details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER25" {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {discountTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.watch('discount_type') !== 'free_item' && (
            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('discount_type') === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={form.watch('discount_type') === 'percentage' ? '15' : '10.00'}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className={form.watch('discount_type') !== 'free_item' ? "" : "md:col-span-2"}>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="15% off your first order" rows={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString() || '')}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>No end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString() || undefined)}
                      disabled={(date) => {
                        const startDate = form.watch('start_date');
                        return startDate ? date <= new Date(startDate) : false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Advanced Options Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          onValueChange={(value) => setShowAdvancedOptions(value === 'advanced')}
        >
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced Restrictions</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-4">
                  {/* Time-based restrictions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Valid Days</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day}
                          control={form.control}
                          name="valid_days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      const currentDays = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentDays, day]);
                                      } else {
                                        field.onChange(currentDays.filter(d => d !== day));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.slice(0, 3)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Valid Hours - Start Time */}
                    <FormField
                      control={form.control}
                      name="valid_hours.start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid From Time</FormLabel>
                          <FormControl>
                            <TimePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Start time"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Valid Hours - End Time */}
                    <FormField
                      control={form.control}
                      name="valid_hours.end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Until Time</FormLabel>
                          <FormControl>
                            <TimePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="End time"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* User segment targeting */}
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="user_segment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select target audience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {USER_SEGMENTS.map(segment => (
                                <SelectItem key={segment.value} value={segment.value}>
                                  {segment.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Purchase requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="min_purchase_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Purchase Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="usage_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Combinable option */}
                  <FormField
                    control={form.control}
                    name="combinable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Allow combining with other promotions
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('discount_type') === 'percentage' && (
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="max_discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Discount Amount ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : promotion ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
