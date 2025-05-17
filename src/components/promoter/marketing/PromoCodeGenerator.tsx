
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromoCodeGeneratorProps } from '@/types/PromoterTypes';

const formSchema = z.object({
  prefix: z.string()
    .min(2, "Prefix must be at least 2 characters")
    .max(5, "Prefix cannot exceed 5 characters")
    .regex(/^[A-Z]+$/, "Prefix must contain only uppercase letters"),
  count: z.number()
    .int()
    .min(1, "Must generate at least 1 code")
    .max(100, "Cannot generate more than 100 codes at once"),
  length: z.number()
    .int()
    .min(5, "Code length must be at least 5 characters")
    .max(12, "Code length cannot exceed 12 characters"),
  includeLetters: z.boolean(),
  includeNumbers: z.boolean(),
  discountType: z.enum(['percentage', 'fixed', 'free_item']),
  discountValue: z.number()
    .min(0, "Discount value must be positive")
    .refine(val => val <= 100, {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"]
    }),
  expiryDate: z.date().nullable(),
});

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ onCodesGenerated, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: 'PROMO',
      count: 10,
      length: 8,
      includeLetters: true,
      includeNumbers: true,
      discountType: 'percentage' as const,
      discountValue: 15,
      expiryDate: null,
    },
  });

  const watchDiscountType = form.watch('discountType');
  
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const generatedCodes = generateCodes(
      data.prefix,
      data.count,
      data.length,
      data.includeLetters,
      data.includeNumbers
    );
    
    onCodesGenerated(generatedCodes);
  };

  const generateCodes = (
    prefix: string,
    count: number,
    length: number,
    includeLetters: boolean,
    includeNumbers: boolean
  ): string[] => {
    const codes: string[] = [];
    const chars = [
      ...(includeLetters ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : ''),
      ...(includeNumbers ? '23456789' : '')
    ].join('');

    // Return empty array if no valid characters to choose from
    if (chars.length === 0) return [];

    for (let i = 0; i < count; i++) {
      let code = prefix + '-';
      
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
      }
      
      codes.push(code);
    }

    return codes;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Promotion Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Prefix</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PROMO"
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Codes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Length</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="includeLetters"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-x-2 space-y-0">
                    <FormLabel>Include Letters</FormLabel>
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
                name="includeNumbers"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-x-2 space-y-0">
                    <FormLabel>Include Numbers</FormLabel>
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
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
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
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">Generate Codes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PromoCodeGenerator;
