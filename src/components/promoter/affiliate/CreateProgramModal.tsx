
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AffiliateProgram } from '@/types/promotional';

const programSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  description: z.string().optional(),
  commission_type: z.enum(['percentage', 'fixed']),
  commission_rate: z.number().min(0),
  min_payout_amount: z.number().min(0).default(50),
  cookie_duration_days: z.number().min(1).max(365).default(30),
  terms_and_conditions: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

interface CreateProgramModalProps {
  open: boolean;
  onClose: () => void;
  onCreateProgram: (data: Omit<AffiliateProgram, 'id' | 'created_at' | 'updated_at'>) => void;
  promoterId: string;
}

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  open,
  onClose,
  onCreateProgram,
  promoterId
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      commission_type: 'percentage',
      min_payout_amount: 50,
      cookie_duration_days: 30,
    }
  });

  const commissionType = watch('commission_type');

  const onSubmit = (data: ProgramFormData) => {
    // Ensure all required fields are present
    const programData: Omit<AffiliateProgram, 'id' | 'created_at' | 'updated_at'> = {
      promoter_id: promoterId,
      name: data.name,
      description: data.description || null,
      commission_type: data.commission_type,
      commission_rate: data.commission_rate,
      min_payout_amount: data.min_payout_amount,
      cookie_duration_days: data.cookie_duration_days,
      terms_and_conditions: data.terms_and_conditions || null,
      is_active: true,
    };
    
    onCreateProgram(programData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Affiliate Program</DialogTitle>
          <DialogDescription>
            Set up a new affiliate program to work with partners who will promote your events.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter program name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your affiliate program"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_type">Commission Type</Label>
              <Select 
                value={commissionType} 
                onValueChange={(value) => setValue('commission_type', value as 'percentage' | 'fixed')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission_rate">
                Commission Rate {commissionType === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="commission_rate"
                type="number"
                step={commissionType === 'percentage' ? '0.1' : '0.01'}
                {...register('commission_rate', { valueAsNumber: true })}
                placeholder={commissionType === 'percentage' ? '5.0' : '10.00'}
              />
              {errors.commission_rate && (
                <p className="text-sm text-red-500">{errors.commission_rate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_payout_amount">Minimum Payout ($)</Label>
              <Input
                id="min_payout_amount"
                type="number"
                step="0.01"
                {...register('min_payout_amount', { valueAsNumber: true })}
                placeholder="50.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookie_duration_days">Cookie Duration (days)</Label>
              <Input
                id="cookie_duration_days"
                type="number"
                {...register('cookie_duration_days', { valueAsNumber: true })}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms_and_conditions">Terms and Conditions</Label>
            <Textarea
              id="terms_and_conditions"
              {...register('terms_and_conditions')}
              placeholder="Enter terms and conditions for affiliates"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Program
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
