
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the form schema
const formSchema = z.object({
  code: z.string()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be less than 20 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, dashes, and underscores are allowed'),
  description: z.string().min(3, 'Description is required'),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'free_item']),
  discountValue: z.coerce.number().min(0, 'Value must be positive'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.coerce.number().int().min(0, 'Must be a non-negative integer').optional(),
  validDays: z.array(z.string()).optional(),
  validHours: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  userSegment: z.enum(['new_customers', 'returning_customers', 'vip', 'all']).optional(),
  combinable: z.boolean().default(true),
  minPurchaseAmount: z.coerce.number().min(0, 'Must be a non-negative number').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PromoCodeGeneratorProps {
  onSubmit: (data: FormValues) => void;
  initialValues?: Partial<FormValues>;
  isEditMode?: boolean;
}

// Day options for valid days selection
const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ 
  onSubmit,
  initialValues,
  isEditMode = false
}) => {
  const [showTimeRestrictions, setShowTimeRestrictions] = useState(
    !!(initialValues?.validDays?.length || initialValues?.validHours)
  );
  
  // Create the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialValues?.code || '',
      description: initialValues?.description || '',
      discountType: initialValues?.discountType || 'percentage',
      discountValue: initialValues?.discountValue || 10,
      startDate: initialValues?.startDate,
      endDate: initialValues?.endDate,
      isActive: initialValues?.isActive ?? true,
      usageLimit: initialValues?.usageLimit,
      validDays: initialValues?.validDays || [],
      validHours: {
        start: initialValues?.validHours?.start || '',
        end: initialValues?.validHours?.end || ''
      },
      userSegment: initialValues?.userSegment || 'all',
      combinable: initialValues?.combinable ?? true,
      minPurchaseAmount: initialValues?.minPurchaseAmount,
    },
  });

  // Submit handler
  const handleSubmit = (values: FormValues) => {
    // If time restrictions are not enabled, remove those values
    if (!showTimeRestrictions) {
      values.validDays = [];
      values.validHours = { start: '', end: '' };
    }
    
    // Process and convert valid hours to ensure both are defined or both are undefined
    let processedValidHours;
    if (values.validHours && (values.validHours.start || values.validHours.end)) {
      processedValidHours = {
        start: values.validHours.start || '00:00',
        end: values.validHours.end || '23:59'
      };
    } else {
      processedValidHours = undefined;
    }
    
    onSubmit({
      ...values,
      validHours: processedValidHours
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields go here */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="SUMMER20" />
                </FormControl>
                <FormDescription>
                  This is the code customers will enter to use this promotion.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountType"
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
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                    <SelectItem value="free_item">Free Item</SelectItem>
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
                  <Input 
                    {...field} 
                    type="number" 
                    min={0} 
                    step={field.value === 'percentage' ? 1 : 0.01}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="20% off your purchase"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="time-restrictions"
                checked={showTimeRestrictions}
                onCheckedChange={(checked) => setShowTimeRestrictions(!!checked)} 
              />
              <label 
                htmlFor="time-restrictions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add date/time restrictions
              </label>
            </div>
            
            {showTimeRestrictions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Valid From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Valid To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              (form.getValues('startDate') && date < form.getValues('startDate'))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">
            {isEditMode ? "Update Promo Code" : "Create Promo Code"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromoCodeGenerator;
