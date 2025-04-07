
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, PlusCircle, Rocket, Star } from 'lucide-react';
import { ImprovementItem } from './types';

interface ProposedImprovementsTabProps {
  improvements: ImprovementItem[];
}

const ProposedImprovementsTab: React.FC<ProposedImprovementsTabProps> = ({ improvements }) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Low</Badge>;
    }
  };

  const renderTypeBadge = (type: 'enhancement' | 'new-feature') => {
    switch (type) {
      case 'enhancement':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Enhancement</Badge>;
      case 'new-feature':
        return <Badge variant="outline" className="border-green-500 text-green-500">New Feature</Badge>;
    }
  };

  const renderAffectedAreas = (areas: ('admin' | 'establishment' | 'individual')[]) => {
    return (
      <div className="flex gap-1 flex-wrap">
        {areas.includes('admin') && (
          <Badge variant="secondary" className="bg-gray-200 text-gray-700">Admin</Badge>
        )}
        {areas.includes('establishment') && (
          <Badge variant="secondary" className="bg-gray-200 text-gray-700">Establishment</Badge>
        )}
        {areas.includes('individual') && (
          <Badge variant="secondary" className="bg-gray-200 text-gray-700">Individual</Badge>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
          Proposed Improvements
        </CardTitle>
        <CardDescription>
          Ideas for enhancing existing features and new features to implement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Proposal
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-1/5">Improvement</TableHead>
              <TableHead className="w-1/3">Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Affects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {improvements.map((improvement, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <button 
                      onClick={() => toggleRow(index)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedRows[index] ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      {improvement.type === 'new-feature' ? 
                        <Star className="h-4 w-4 text-amber-400 mr-1" /> : 
                        <span></span>
                      }
                      {improvement.name}
                    </div>
                  </TableCell>
                  <TableCell>{improvement.description}</TableCell>
                  <TableCell>{renderPriorityBadge(improvement.priority)}</TableCell>
                  <TableCell>{renderTypeBadge(improvement.type)}</TableCell>
                  <TableCell>{renderAffectedAreas(improvement.affectedAreas)}</TableCell>
                </TableRow>
                {expandedRows[index] && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={1}></TableCell>
                    <TableCell colSpan={5} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 font-medium">Implementation Steps:</div>
                          <ol className="list-decimal pl-5 space-y-1">
                            {improvement.implementationSteps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="mb-1 font-medium text-sm">Estimated Effort</div>
                            <div className="text-sm">{improvement.estimatedEffort}</div>
                          </div>
                          <div>
                            <div className="mb-1 font-medium text-sm">Business Impact</div>
                            <div className="text-sm">{improvement.businessImpact}</div>
                          </div>
                        </div>

                        {improvement.technicalRequirements && (
                          <div>
                            <div className="mb-1 font-medium text-sm">Technical Requirements</div>
                            <div className="text-sm bg-gray-100 p-2 rounded border">
                              {improvement.technicalRequirements}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProposedImprovementsTab;
