
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAllFeatureSegments } from '@/lib/features/api';
import { useToast } from '@/hooks/use-toast';

interface FeatureSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

const FeatureSegmentMonitoring: React.FC = () => {
  const [segments, setSegments] = useState<FeatureSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const mockSegments = [
    { 
      id: '1', 
      name: 'Premium Users', 
      description: 'Users with a premium subscription',
      criteria: { subscription_tier: { equals: 'premium' } },
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      member_count: 342
    },
    { 
      id: '2', 
      name: 'High Engagement Users', 
      description: 'Users with high engagement metrics',
      criteria: { engagement_score: { gt: 80 } },
      created_at: '2023-02-01T00:00:00Z',
      updated_at: '2023-02-01T00:00:00Z',
      member_count: 156
    },
    { 
      id: '3', 
      name: 'Beta Testers', 
      description: 'Users who have opted in for beta features',
      criteria: { beta_tester: { equals: true } },
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2023-03-01T00:00:00Z',
      member_count: 78
    },
  ];

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        // In a real implementation, fetch segments from the API
        // const fetchedSegments = await getAllFeatureSegments();
        // setSegments(fetchedSegments);
        
        // Using mock data for now
        setTimeout(() => {
          setSegments(mockSegments);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching feature segments:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load segments',
          description: 'Could not load feature segments. Please try again.',
        });
        setIsLoading(false);
      }
    };

    fetchSegments();
  }, [toast]);

  const renderCriteria = (criteria: Record<string, any>) => {
    return Object.entries(criteria).map(([key, value]) => {
      const operation = Object.keys(value)[0];
      const operationValue = value[operation];
      
      let displayOperation = operation;
      switch (operation) {
        case 'equals': displayOperation = '='; break;
        case 'gt': displayOperation = '>'; break;
        case 'lt': displayOperation = '<'; break;
        case 'gte': displayOperation = '≥'; break;
        case 'lte': displayOperation = '≤'; break;
        default: break;
      }
      
      return (
        <Badge key={key} variant="outline" className="mr-2 mb-2">
          {key} {displayOperation} {operationValue.toString()}
        </Badge>
      );
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">Loading feature segments...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Feature Segments</h3>
        <Button>Create New Segment</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Criteria</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment.id}>
              <TableCell className="font-medium">{segment.name}</TableCell>
              <TableCell>{segment.description}</TableCell>
              <TableCell>{renderCriteria(segment.criteria)}</TableCell>
              <TableCell>{segment.member_count}</TableCell>
              <TableCell>{new Date(segment.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {segments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No feature segments found. Create your first segment to get started.
        </div>
      )}
    </div>
  );
};

export default FeatureSegmentMonitoring;
