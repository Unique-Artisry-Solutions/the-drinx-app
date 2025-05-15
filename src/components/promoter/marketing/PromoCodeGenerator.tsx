
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface PromoCodeGeneratorProps {
  onSubmit: (formData: any) => Promise<void>;
}

export const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    description: '',
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    minPurchase: '',
    userSegment: 'all',
    validDays: [] as string[],
    validHours: { start: '', end: '' },
    combinable: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDayToggle = (day: string) => {
    const currentDays = [...formData.validDays];
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        validDays: currentDays.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        validDays: [...currentDays, day],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString(),
        validHours: formData.validHours.start && formData.validHours.end ? formData.validHours : null,
        validDays: formData.validDays.length > 0 ? formData.validDays : null,
        userSegment: formData.userSegment !== 'all' ? formData.userSegment : null,
      });
      
      // Reset form on success
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        description: '',
        startDate: new Date(),
        endDate: undefined,
        minPurchase: '',
        userSegment: 'all',
        validDays: [],
        validHours: { start: '', end: '' },
        combinable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Code Input */}
          <div className="space-y-2">
            <Label htmlFor="code">Promotion Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER25"
              className="uppercase"
              required
            />
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select
              value={formData.discountType}
              onValueChange={(value) => setFormData({ ...formData, discountType: value })}
            >
              <SelectTrigger id="discountType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="free_item">Free Item</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <Label htmlFor="discountValue">
              {formData.discountType === 'percentage' ? 'Percentage Off' : 'Amount Off ($)'}
            </Label>
            <div className="relative">
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '25' : '10.00'}
                required
                disabled={formData.discountType === 'free_item'}
                className="pr-8"
              />
              {formData.discountType === 'percentage' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  %
                </div>
              )}
              {formData.discountType === 'fixed' && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  $
                </div>
              )}
            </div>
          </div>

          {/* Minimum Purchase */}
          <div className="space-y-2">
            <Label htmlFor="minPurchase">Minimum Purchase ($)</Label>
            <Input
              id="minPurchase"
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              placeholder="0.00"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Valid From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => setFormData({ ...formData, startDate: date || new Date() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Valid Until (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(formData.endDate, "PPP") : <span>No end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => setFormData({ ...formData, endDate: date })}
                  disabled={(date) => date < formData.startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Summer sale promotion"
            required
          />
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-md font-medium">Advanced Settings</h3>
          
          {/* User Segment */}
          <div className="space-y-2">
            <Label htmlFor="userSegment">User Segment</Label>
            <Select
              value={formData.userSegment}
              onValueChange={(value) => setFormData({ ...formData, userSegment: value })}
            >
              <SelectTrigger id="userSegment">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new">New Customers Only</SelectItem>
                <SelectItem value="returning">Returning Customers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Restrictions */}
          <div className="space-y-2">
            <Label>Valid Hours (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.validHours.start}
                  onChange={(e) => setFormData({
                    ...formData,
                    validHours: { ...formData.validHours, start: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-xs">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.validHours.end}
                  onChange={(e) => setFormData({
                    ...formData,
                    validHours: { ...formData.validHours, end: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
          
          {/* Day Restrictions */}
          <div className="space-y-2">
            <Label>Valid Days (Optional)</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.validDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day.substring(0, 3)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Combinable */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="combinable"
              checked={formData.combinable}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, combinable: checked as boolean })
              }
            />
            <Label htmlFor="combinable" className="text-sm font-normal">
              Combinable with other promotions
            </Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Promotion Code'}
      </Button>
    </form>
  );
};

export default PromoCodeGenerator;
