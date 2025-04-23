
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ArrowUpCircle, Minus, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrioritySelectProps {
  name: string;
  isLightTheme: boolean;
}

const priorities = [
  { value: 'urgent', label: 'Urgent', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { value: 'high', label: 'High', icon: <ArrowUpCircle className="h-4 w-4 text-orange-500" /> },
  { value: 'medium', label: 'Medium', icon: <Minus className="h-4 w-4 text-yellow-500" /> },
  { value: 'low', label: 'Low', icon: <ArrowDownCircle className="h-4 w-4 text-green-500" /> }
];

const PrioritySelect: React.FC<PrioritySelectProps> = ({ name, isLightTheme }) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
            Priority Level
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-2"
            >
              {priorities.map((priority) => (
                <div key={priority.value} className="flex items-center space-x-1">
                  <RadioGroupItem value={priority.value} id={`${name}-${priority.value}`} />
                  <Label 
                    htmlFor={`${name}-${priority.value}`} 
                    className="flex items-center gap-1 text-sm"
                  >
                    {priority.icon}
                    {priority.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PrioritySelect;
