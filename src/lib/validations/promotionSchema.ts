
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
  discountType: z.enum(['percentage', 'fixed', 'free_item']),
  discountValue: z
    .number()
    .min(0, "Discount value must be a positive number")
    .refine(
      (val) => val <= 100 || val.toString() === '',
      { message: "Percentage discount cannot exceed 100%" }
    ),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  validDays: z.array(z.string()).optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  isActive: z.boolean().default(true),
  minPurchaseAmount: z.number().min(0).nullable().optional(),
  combinable: z.boolean().default(true),
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
