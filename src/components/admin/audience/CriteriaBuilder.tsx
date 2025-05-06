
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, X } from 'lucide-react';
import { AudienceFilter } from '@/types/AudienceTypes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CriteriaBuilderProps {
  criteria: AudienceFilter[];
  onChange: (criteria: AudienceFilter[]) => void;
}

export const CriteriaBuilder: React.FC<CriteriaBuilderProps> = ({ 
  criteria, 
  onChange 
}) => {
  const [filterType, setFilterType] = useState('demographics');
  const [filterOperator, setFilterOperator] = useState('equals');
  const [filterValue, setFilterValue] = useState('');
  
  const addCriterion = () => {
    if (!filterValue.trim()) return;
    
    let description = '';
    
    switch (filterType) {
      case 'demographics':
        description = `User demographics: ${filterValue}`;
        break;
      case 'behavior':
        description = `User behavior: ${filterValue}`;
        break;
      case 'location':
        description = `User location: ${filterValue}`;
        break;
      case 'interests':
        description = `User interests: ${filterValue}`;
        break;
      case 'engagement':
        description = `User engagement: ${filterValue}`;
        break;
      default:
        description = `${filterType}: ${filterValue}`;
    }
    
    const newFilter: AudienceFilter = {
      id: `filter-${Date.now()}`,
      type: filterType,
      value: filterValue,
      operator: filterOperator,
      description
    };
    
    onChange([...criteria, newFilter]);
    setFilterValue('');
  };
  
  const removeCriterion = (filterId: string) => {
    onChange(criteria.filter(filter => filter.id !== filterId));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Criteria
          </CardTitle>
          <CardDescription>
            Define filtering criteria for this audience segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Criteria type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demographics">Demographics</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="interests">Interests</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filterOperator} 
              onValueChange={setFilterOperator}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Criteria value..." 
              value={filterValue} 
              onChange={(e) => setFilterValue(e.target.value)} 
              className="flex-1"
            />
            
            <Button onClick={addCriterion} type="button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Criteria
            </Button>
          </div>
          
          {criteria.length === 0 ? (
            <Alert>
              <AlertTitle>No criteria defined</AlertTitle>
              <AlertDescription>
                Without criteria, this segment will include all users. Add criteria to narrow your audience.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {criteria.map(filter => (
                <Badge 
                  key={filter.id} 
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1"
                >
                  {filter.description}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeCriterion(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Estimated Audience Size</CardTitle>
          <CardDescription>
            Based on your criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              {criteria.length === 0 ? 'All Users' : `${Math.floor(Math.random() * 1000) + 100} Users`}
            </span>
            <Button variant="outline" size="sm" disabled={criteria.length === 0}>
              Preview Audience
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
