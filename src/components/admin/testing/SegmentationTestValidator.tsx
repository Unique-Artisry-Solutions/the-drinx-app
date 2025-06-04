
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface SegmentCriteria {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

interface ValidationResult {
  isValid: boolean;
  memberCount: number;
  estimatedMembers: number;
  issues: string[];
  warnings: string[];
  suggestions: string[];
}

export const SegmentationTestValidator: React.FC = () => {
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [criteria, setCriteria] = useState<SegmentCriteria[]>([
    { id: '1', field: 'age', operator: 'greater_than', value: '18' }
  ]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const availableFields = [
    { value: 'age', label: 'Age' },
    { value: 'location', label: 'Location' },
    { value: 'signup_date', label: 'Signup Date' },
    { value: 'last_activity', label: 'Last Activity' },
    { value: 'total_visits', label: 'Total Visits' },
    { value: 'favorite_venues', label: 'Favorite Venues' },
    { value: 'event_attendance', label: 'Event Attendance' },
    { value: 'user_type', label: 'User Type' },
    { value: 'subscription_status', label: 'Subscription Status' }
  ];

  const operatorsByField: Record<string, Array<{value: string, label: string}>> = {
    age: [
      { value: 'equals', label: 'Equals' },
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
      { value: 'between', label: 'Between' }
    ],
    location: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'in_list', label: 'In List' }
    ],
    signup_date: [
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' }
    ],
    default: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' }
    ]
  };

  const addCriteria = () => {
    const newId = (criteria.length + 1).toString();
    setCriteria([
      ...criteria,
      { id: newId, field: 'age', operator: 'equals', value: '', logicalOperator: 'AND' }
    ]);
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriteria = (id: string, updates: Partial<SegmentCriteria>) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const validateSegment = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock validation results
    const mockResult: ValidationResult = {
      isValid: Math.random() > 0.3,
      memberCount: Math.floor(Math.random() * 10000) + 100,
      estimatedMembers: Math.floor(Math.random() * 12000) + 80,
      issues: [],
      warnings: [],
      suggestions: []
    };

    // Add some realistic issues and warnings based on criteria
    criteria.forEach((criterion, index) => {
      if (!criterion.value.trim()) {
        mockResult.issues.push(`Criteria ${index + 1}: Value is required for ${criterion.field}`);
        mockResult.isValid = false;
      }
      
      if (criterion.field === 'age' && criterion.operator === 'greater_than' && parseInt(criterion.value) > 65) {
        mockResult.warnings.push(`Age filter may result in very small segment (${criterion.value}+ years)`);
      }
      
      if (criterion.field === 'location' && criterion.value.length < 3) {
        mockResult.warnings.push(`Location filter "${criterion.value}" may be too broad`);
      }
    });

    // Add suggestions
    if (criteria.length === 1) {
      mockResult.suggestions.push('Consider adding additional criteria to better target your audience');
    }
    
    if (mockResult.memberCount < 50) {
      mockResult.suggestions.push('Segment size is very small - consider relaxing some criteria');
    }
    
    if (mockResult.memberCount > 5000) {
      mockResult.suggestions.push('Large segment detected - consider adding more specific criteria');
    }

    setValidationResult(mockResult);
    setIsValidating(false);

    toast({
      title: mockResult.isValid ? "Validation Passed" : "Validation Failed",
      description: mockResult.isValid 
        ? `Segment is valid with ${mockResult.memberCount} members`
        : "Please fix the issues before proceeding",
      variant: mockResult.isValid ? "default" : "destructive"
    });
  };

  const getOperatorsForField = (field: string) => {
    return operatorsByField[field] || operatorsByField.default;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Segmentation Test Validator
          </CardTitle>
          <CardDescription>
            Test and validate audience segment criteria before deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="segment-name">Segment Name</Label>
              <Input
                id="segment-name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="Enter segment name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment-description">Description</Label>
              <Textarea
                id="segment-description"
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
                placeholder="Describe the segment"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Segment Criteria</Label>
              <Button onClick={addCriteria} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Criteria
              </Button>
            </div>

            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="space-y-3 p-4 border rounded-lg">
                {index > 0 && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={criterion.logicalOperator}
                      onValueChange={(value: 'AND' | 'OR') => 
                        updateCriteria(criterion.id, { logicalOperator: value })
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Select
                    value={criterion.field}
                    onValueChange={(value) => updateCriteria(criterion.id, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={criterion.operator}
                    onValueChange={(value) => updateCriteria(criterion.id, { operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorsForField(criterion.field).map((operator) => (
                        <SelectItem key={operator.value} value={operator.value}>
                          {operator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={criterion.value}
                    onChange={(e) => updateCriteria(criterion.id, { value: e.target.value })}
                    placeholder="Enter value"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCriteria(criterion.id)}
                    disabled={criteria.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={validateSegment}
            disabled={isValidating || !segmentName.trim()}
            className="w-full"
          >
            {isValidating ? 'Validating...' : 'Validate Segment'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Validation Results
            </CardTitle>
            <CardDescription>
              Segment validation completed for "{segmentName}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {validationResult.memberCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Members</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-secondary">
                    {validationResult.estimatedMembers.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Estimated Members</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Segment Health</span>
                  <Badge variant={validationResult.isValid ? 'success' as any : 'destructive'}>
                    {validationResult.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>

                {validationResult.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Issues</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {validationResult.issues.map((issue, index) => (
                        <li key={index} className="text-red-600">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Warnings</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-600">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Suggestions</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {validationResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-blue-600">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SegmentationTestValidator;
