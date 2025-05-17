
import * as z from 'zod';

// Schema for promotions form validation
export const promotionFormSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, underscores, or hyphens"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),
  discount_type: z.enum(['percentage', 'fixed', 'free_item']),
  discount_value: z
    .number()
    .min(0, "Discount value must be a positive number")
    .refine(
      (val) => val <= 100 || val.toString() === '',
      { message: "Percentage discount cannot exceed 100%" }
    ),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  valid_days: z.array(z.string()).optional(),
  usage_limit: z.number().int().min(1).nullable().optional(),
  is_active: z.boolean().default(true),
  min_purchase_amount: z.number().min(0).nullable().optional(),
  combinable: z.boolean().default(true),
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
