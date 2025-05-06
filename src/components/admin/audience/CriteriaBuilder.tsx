
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash } from 'lucide-react';

interface CriteriaBuilderProps {
  onAddCriterion: (criterion: any) => void;
}

export const CriteriaBuilder: React.FC<CriteriaBuilderProps> = ({ onAddCriterion }) => {
  const [criterionType, setCriterionType] = useState('demographics');
  const [operator, setOperator] = useState('equals');
  const [demographicField, setDemographicField] = useState('age_group');
  const [valueInput, setValueInput] = useState('');
  const [listValues, setListValues] = useState<string[]>([]);
  const [tempListValue, setTempListValue] = useState('');
  
  // Define the options based on criterion type
  const operatorOptions = {
    demographics: ['equals', 'not_equals', 'in_list'],
    behavior: ['performed', 'not_performed', 'performed_times'],
    engagement: ['greater_than', 'less_than', 'between'],
    location: ['within_radius', 'not_within_radius'],
  };
  
  const demographicFields = [
    { value: 'age_group', label: 'Age Group' },
    { value: 'gender', label: 'Gender' },
    { value: 'membership_level', label: 'Membership Level' },
    { value: 'join_date', label: 'Join Date' },
  ];
  
  const behaviorTypes = [
    { value: 'purchase', label: 'Made a Purchase' },
    { value: 'visited', label: 'Visited Location' },
    { value: 'referred', label: 'Referred a Friend' },
    { value: 'logged_in', label: 'Logged In' },
  ];
  
  const engagementMetrics = [
    { value: 'visits', label: 'Number of Visits' },
    { value: 'average_spend', label: 'Average Spend' },
    { value: 'time_spent', label: 'Time Spent on App' },
    { value: 'days_since_last_visit', label: 'Days Since Last Visit' },
  ];
  
  const handleAddListValue = () => {
    if (tempListValue.trim()) {
      setListValues([...listValues, tempListValue.trim()]);
      setTempListValue('');
    }
  };
  
  const handleRemoveListValue = (indexToRemove: number) => {
    setListValues(listValues.filter((_, index) => index !== indexToRemove));
  };
  
  const handleAddCriterion = () => {
    let criterionValue: any;
    
    switch (criterionType) {
      case 'demographics':
        if (operator === 'in_list') {
          criterionValue = {
            field: demographicField,
            values: listValues
          };
        } else {
          criterionValue = {
            field: demographicField,
            value: valueInput
          };
        }
        break;
        
      case 'behavior':
        criterionValue = {
          activity_type: valueInput,
          min_count: operator === 'performed_times' ? parseInt(valueInput, 10) : undefined
        };
        break;
        
      case 'engagement':
        criterionValue = {
          metric: valueInput,
          min_value: operator === 'greater_than' || operator === 'between' ? parseInt(valueInput, 10) : undefined,
          max_value: operator === 'less_than' || operator === 'between' ? parseInt(valueInput, 10) : undefined
        };
        break;
        
      case 'location':
        criterionValue = {
          coordinates: {
            latitude: 0,
            longitude: 0
          },
          radius: parseInt(valueInput, 10) || 5
        };
        break;
        
      default:
        criterionValue = valueInput;
    }
    
    onAddCriterion({
      type: criterionType,
      operator,
      value: criterionValue
    });
    
    // Reset form
    setValueInput('');
    setListValues([]);
  };
  
  // Render different input fields based on criterion type and operator
  const renderInputFields = () => {
    switch (criterionType) {
      case 'demographics':
        return (
          <>
            <FormItem className="flex-1">
              <FormLabel>Field</FormLabel>
              <Select 
                value={demographicField} 
                onValueChange={setDemographicField}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {demographicFields.map(field => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            
            {operator === 'in_list' ? (
              <div className="space-y-2 w-full">
                <div className="flex items-center space-x-2">
                  <Input 
                    value={tempListValue} 
                    onChange={(e) => setTempListValue(e.target.value)}
                    placeholder="Add value"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddListValue}>Add</Button>
                </div>
                
                {listValues.length > 0 && (
                  <div className="p-2 border rounded-md space-y-1">
                    <FormLabel>Values List:</FormLabel>
                    <div className="space-y-1">
                      {listValues.map((value, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-sm">
                          <span>{value}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveListValue(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FormItem className="flex-1">
                <FormLabel>Value</FormLabel>
                <Input 
                  value={valueInput} 
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="Enter value"
                />
              </FormItem>
            )}
          </>
        );
        
      case 'behavior':
        return (
          <>
            <FormItem className="flex-1">
              <FormLabel>Activity Type</FormLabel>
              <Select 
                value={valueInput} 
                onValueChange={setValueInput}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {behaviorTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            
            {operator === 'performed_times' && (
              <FormItem className="flex-1">
                <FormLabel>Minimum Times</FormLabel>
                <Input 
                  type="number" 
                  value={valueInput} 
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="Enter minimum times"
                />
              </FormItem>
            )}
          </>
        );
        
      case 'engagement':
        return (
          <>
            <FormItem className="flex-1">
              <FormLabel>Metric</FormLabel>
              <Select 
                value={valueInput} 
                onValueChange={setValueInput}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {engagementMetrics.map(metric => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            
            <FormItem className="flex-1">
              <FormLabel>{operator === 'less_than' ? 'Maximum' : 'Minimum'} Value</FormLabel>
              <Input 
                type="number" 
                value={valueInput} 
                onChange={(e) => setValueInput(e.target.value)}
                placeholder={`Enter ${operator === 'less_than' ? 'maximum' : 'minimum'} value`}
              />
            </FormItem>
            
            {operator === 'between' && (
              <FormItem className="flex-1">
                <FormLabel>Maximum Value</FormLabel>
                <Input 
                  type="number" 
                  value={valueInput} 
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="Enter maximum value"
                />
              </FormItem>
            )}
          </>
        );
      
      default:
        return (
          <FormItem className="flex-1">
            <FormLabel>Value</FormLabel>
            <Input 
              value={valueInput} 
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="Enter value"
            />
          </FormItem>
        );
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Criterion Type</FormLabel>
              <Select 
                value={criterionType} 
                onValueChange={(value) => {
                  setCriterionType(value);
                  setOperator(operatorOptions[value as keyof typeof operatorOptions][0]);
                  setValueInput('');
                  setListValues([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="behavior">Behavior</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <FormLabel>Operator</FormLabel>
              <Select 
                value={operator} 
                onValueChange={(value) => {
                  setOperator(value);
                  // Reset values when operator changes
                  setValueInput('');
                  if (value === 'in_list') {
                    setListValues([]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operatorOptions[criterionType as keyof typeof operatorOptions]?.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {renderInputFields()}
            </div>
            
            <Button 
              type="button" 
              onClick={handleAddCriterion}
              disabled={
                (operator === 'in_list' && listValues.length === 0) ||
                (operator !== 'in_list' && !valueInput)
              }
              className="w-full"
            >
              Add Criterion
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
