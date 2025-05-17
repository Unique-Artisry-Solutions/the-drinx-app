import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { promotionSchema } from '@/lib/validations/promotionSchema';
import { PromotionFormData } from '@/types/PromotionTypes';
import DatePickerWithRange from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';

const discountTypes = ["percentage", "fixed_amount", "free_item", "bogo"];
const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const PromotionForm: React.FC<{
  onSubmit: (data: PromotionFormData) => Promise<void>;
  initialData?: Partial<PromotionFormData>;
}> = ({ onSubmit, initialData }) => {
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: initialData || {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      validDays: [],
      usageLimit: 100,
      isActive: true,
    },
    mode: "onChange"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Promotion</CardTitle>
        <CardDescription>
          Define a promotion for your establishment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="PROMO123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the promotion"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
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
                        <SelectValue placeholder="Select a discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {discountTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Controller
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                      <DatePickerWithRange
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Controller
                    name="endDate"
                    control={form.control}
                    render={({ field }) => (
                      <DatePickerWithRange
                        date={field.value}
                        onDateChange={field.onChange}
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validDays"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Valid Days</FormLabel>
                  <div className="flex flex-wrap items-center space-x-2">
                    {validDays.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="validDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              className="flex flex-row items-center space-x-1 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], day])
                                      : field.onChange(field.value?.filter((value) => value !== day))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Set the promotion as active or inactive.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CardFooter>
              <Button type="submit">Create Promotion</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;
