
export interface PromotionFormProps {
  onSubmit: (data: PromotionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PromotionFormData>;
  isEditing?: boolean;
}

export interface PromotionFormData {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  startDate: Date;
  endDate: Date | null;
  validDays?: string[];
  usageLimit?: number | null;
  isActive: boolean;
  minPurchaseAmount?: number | null;
  combinable?: boolean;
}

export interface DayOption {
  label: string;
  value: string;
}

export const dayOptions: DayOption[] = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

export interface DiscountTypeOption {
  label: string;
  value: 'percentage' | 'fixed' | 'free_item';
  description: string;
}

export const discountTypeOptions: DiscountTypeOption[] = [
  { 
    label: 'Percentage', 
    value: 'percentage', 
    description: 'Discount as percentage of purchase' 
  },
  { 
    label: 'Fixed Amount', 
    value: 'fixed', 
    description: 'Fixed dollar amount discount' 
  },
  { 
    label: 'Free Item', 
    value: 'free_item', 
    description: 'Free item with purchase' 
  }
];
