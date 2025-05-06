
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Check, Plus } from 'lucide-react';
import { audience_filter_operator } from '@/types/AudienceTypes';

interface CriteriaBuilderProps {
  onAddCriterion: (criterion: any) => void;
}

// Available criteria types
const criteriaTypes = [
  { value: 'demographics', label: 'Demographics' },
  { value: 'behavior', label: 'User Behavior' },
  { value: 'engagement', label: 'Engagement Level' },
  { value: 'location', label: 'Location' },
  { value: 'custom', label: 'Custom Attribute' },
];

// Mapping of criteria types to available fields
const criteriaFields: Record<string, { value: string; label: string }[]> = {
  demographics: [
    { value: 'age', label: 'Age' },
    { value: 'gender', label: 'Gender' },
    { value: 'user_type', label: 'User Type' },
  ],
  behavior: [
    { value: 'activity_type', label: 'Activity Type' },
    { value: 'recent_action', label: 'Recent Action' },
    { value: 'last_login', label: 'Last Login Date' },
  ],
  engagement: [
    { value: 'min_visits', label: 'Minimum Visits' },
    { value: 'min_events', label: 'Minimum Events' },
    { value: 'inactive_days', label: 'Days Inactive' },
  ],
  location: [
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State/Province' },
    { value: 'country', label: 'Country' },
    { value: 'radius', label: 'Within Radius' },
  ],
  custom: [
    { value: 'custom_field', label: 'Custom Field' },
  ],
};

// Map of criteria types to available operators
const operatorMap: Record<string, { value: audience_filter_operator; label: string }[]> = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'in_list', label: 'In List' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' },
  ],
  boolean: [
    { value: 'equals', label: 'Equals' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'After' },
    { value: 'less_than', label: 'Before' },
    { value: 'between', label: 'Between' },
  ],
};

export const CriteriaBuilder: React.FC<CriteriaBuilderProps> = ({ onAddCriterion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [criteriaType, setCriteriaType] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [operator, setOperator] = useState<audience_filter_operator>('equals');
  const [value, setValue] = useState<string>('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  const [listValues, setListValues] = useState<string[]>([]);
  const [customFieldName, setCustomFieldName] = useState<string>('');
  
  // Reset form state
  const resetForm = () => {
    setCriteriaType('');
    setField('');
    setOperator('equals');
    setValue('');
    setMinValue('');
    setMaxValue('');
    setListValues([]);
    setCustomFieldName('');
  };
  
  // Handle form submission
  const handleAddCriterion = () => {
    let criterionValue: any;
    
    // Build the value based on the operator
    if (operator === 'between') {
      criterionValue = { min: minValue, max: maxValue };
    } else if (operator === 'in_list') {
      criterionValue = listValues;
    } else {
      criterionValue = value;
    }
    
    // For custom fields, use the custom field name
    const finalField = criteriaType === 'custom' ? customFieldName : field;
    
    // Build the criterion object
    const criterion = {
      type: criteriaType,
      field: finalField,
      operator,
      value: criteriaType === 'behavior' && field === 'activity_type' 
        ? { activity_type: value } 
        : { [finalField]: criterionValue },
      description: buildCriterionDescription(),
    };
    
    onAddCriterion(criterion);
    setIsOpen(false);
    resetForm();
  };
  
  // Build a human-readable description of the criterion
  const buildCriterionDescription = (): string => {
    const fieldLabel = getFieldLabel();
    const operatorLabel = getOperatorLabel();
    
    if (operator === 'between') {
      return `${fieldLabel} is between ${minValue} and ${maxValue}`;
    }
    
    if (operator === 'in_list') {
      return `${fieldLabel} is one of [${listValues.join(', ')}]`;
    }
    
    return `${fieldLabel} ${operatorLabel} ${value}`;
  };
  
  // Get the field label for the selected field
  const getFieldLabel = (): string => {
    if (criteriaType === 'custom') {
      return customFieldName;
    }
    
    const fields = criteriaFields[criteriaType] || [];
    const selectedField = fields.find(f => f.value === field);
    return selectedField?.label || field;
  };
  
  // Get the operator label for the selected operator
  const getOperatorLabel = (): string => {
    const dataType = getDataTypeForField();
    const operators = operatorMap[dataType] || [];
    const selectedOperator = operators.find(o => o.value === operator);
    return selectedOperator?.label || operator;
  };
  
  // Determine the data type for the selected field
  const getDataTypeForField = (): string => {
    if (criteriaType === 'demographics' && field === 'age') return 'number';
    if (criteriaType === 'engagement') return 'number';
    if (criteriaType === 'behavior' && field === 'last_login') return 'date';
    return 'string';
  };
  
  // Get available operators for the selected field
  const getOperatorsForField = () => {
    const dataType = getDataTypeForField();
    return operatorMap[dataType] || operatorMap.string;
  };
  
  // Render the appropriate value input based on the operator
  const renderValueInput = () => {
    if (!field && criteriaType !== 'custom') return null;
    
    if (operator === 'between') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            placeholder="Min value"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Max value"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
          />
        </div>
      );
    }
    
    if (operator === 'in_list') {
      return (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (value.trim()) {
                  setListValues([...listValues, value.trim()]);
                  setValue('');
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {listValues.length > 0 && (
            <div className="flex flex-wrap gap-1 p-2 border rounded-md">
              {listValues.map((val, index) => (
                <div
                  key={index}
                  className="flex items-center bg-muted px-2 py-1 rounded text-xs"
                >
                  {val}
                  <button
                    type="button"
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setListValues(listValues.filter((_, i) => i !== index))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (criteriaType === 'demographics' && field === 'gender') {
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (criteriaType === 'demographics' && field === 'user_type') {
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="establishment">Establishment</SelectItem>
            <SelectItem value="promoter">Promoter</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (criteriaType === 'behavior' && field === 'activity_type') {
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select activity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="page_view">Page View</SelectItem>
            <SelectItem value="establishment_visit">Establishment Visit</SelectItem>
            <SelectItem value="cocktail_order">Cocktail Order</SelectItem>
            <SelectItem value="review_submission">Review Submission</SelectItem>
            <SelectItem value="bar_crawl_join">Bar Crawl Join</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (criteriaType === 'engagement' && field === 'min_visits') {
      return (
        <div className="space-y-4">
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            value={[parseInt(value) || 0]}
            onValueChange={(vals) => setValue(vals[0].toString())}
          />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">0</span>
            <span className="text-sm">{value || '0'} visits</span>
            <span className="text-sm text-muted-foreground">100</span>
          </div>
        </div>
      );
    }
    
    return (
      <Input
        type="text"
        placeholder="Enter value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  };
  
  return (
    <div className="mt-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full border-dashed">
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="center">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Add Targeting Criterion</h3>
                <Separator />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Criteria Type</label>
                  <Select value={criteriaType} onValueChange={setCriteriaType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select criteria type" />
                    </SelectTrigger>
                    <SelectContent>
                      {criteriaTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {criteriaType === 'custom' ? (
                  <div>
                    <label className="text-sm font-medium">Custom Field Name</label>
                    <Input
                      placeholder="Enter field name"
                      value={customFieldName}
                      onChange={(e) => setCustomFieldName(e.target.value)}
                    />
                  </div>
                ) : criteriaType && (
                  <div>
                    <label className="text-sm font-medium">Field</label>
                    <Select value={field} onValueChange={setField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {(criteriaFields[criteriaType] || []).map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {(field || criteriaType === 'custom') && (
                  <div>
                    <label className="text-sm font-medium">Operator</label>
                    <Select value={operator} onValueChange={(value) => setOperator(value as audience_filter_operator)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorsForField().map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {renderValueInput()}
              </div>
              
              <div className="pt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    !criteriaType || 
                    (criteriaType !== 'custom' && !field) ||
                    (operator === 'between' && (!minValue || !maxValue)) ||
                    (operator === 'in_list' && listValues.length === 0) ||
                    (operator !== 'between' && operator !== 'in_list' && !value && criteriaType !== 'engagement') ||
                    (criteriaType === 'custom' && !customFieldName)
                  }
                  onClick={handleAddCriterion}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};
