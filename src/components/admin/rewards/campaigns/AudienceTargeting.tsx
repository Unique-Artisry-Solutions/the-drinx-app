
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, X } from 'lucide-react';
import { AudienceFilter } from '@/lib/rewards/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AudienceTargetingProps {
  filters: AudienceFilter[];
  onChange: (filters: AudienceFilter[]) => void;
}

export const AudienceTargeting = ({ filters, onChange }: AudienceTargetingProps) => {
  const [filterType, setFilterType] = useState('tier');
  const [filterValue, setFilterValue] = useState('');
  
  const addFilter = () => {
    if (!filterValue.trim()) return;
    
    let description = '';
    
    switch (filterType) {
      case 'tier':
        description = `Users in tier: ${filterValue}`;
        break;
      case 'pointsRange':
        description = `Users with points: ${filterValue}`;
        break;
      case 'activity':
        description = `Users with activity: ${filterValue}`;
        break;
      case 'joinDate':
        description = `Users who joined: ${filterValue}`;
        break;
      case 'demographics':
        description = `Users matching: ${filterValue}`;
        break;
      case 'all':
        description = 'All users';
        break;
      default:
        description = `${filterType}: ${filterValue}`;
    }
    
    const newFilter: AudienceFilter = {
      id: `filter-${Date.now()}`,
      type: filterType as AudienceFilter['type'],
      value: filterValue,
      description
    };
    
    onChange([...filters, newFilter]);
    setFilterValue('');
  };
  
  const removeFilter = (filterId: string) => {
    onChange(filters.filter(filter => filter.id !== filterId));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Targeting
          </CardTitle>
          <CardDescription>
            Define which users will be eligible for this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="tier">Reward Tier</SelectItem>
                <SelectItem value="pointsRange">Points Range</SelectItem>
                <SelectItem value="activity">Activity Level</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
                <SelectItem value="demographics">Demographics</SelectItem>
              </SelectContent>
            </Select>
            
            {filterType !== 'all' && (
              <Input 
                placeholder="Filter value..." 
                value={filterValue} 
                onChange={(e) => setFilterValue(e.target.value)} 
                className="flex-1"
              />
            )}
            
            <Button onClick={addFilter} type="button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
          
          {filters.length === 0 ? (
            <Alert>
              <AlertTitle>No audience filters defined</AlertTitle>
              <AlertDescription>
                Without filters, this campaign will target all users. Add filters to narrow your audience.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
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
                    onClick={() => removeFilter(filter.id)}
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
            Based on your targeting criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              {filters.length === 0 ? 'All Users' : `${Math.floor(Math.random() * 1000) + 100} Users`}
            </span>
            <Button variant="outline" size="sm">
              View Audience Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
