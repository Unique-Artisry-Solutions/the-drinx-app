
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, PlusCircle, Rocket, Star, ArrowUpDown, Check, AlertTriangle } from 'lucide-react';
import { ImprovementItem, SortField, SortOrder } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProposedImprovementsTabProps {
  improvements: ImprovementItem[];
}

const ProposedImprovementsTab: React.FC<ProposedImprovementsTabProps> = ({ improvements }) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedImprovements = useMemo(() => {
    return [...improvements].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'lovableCompatible':
          const aCompatible = a.lovableCompatible ?? false;
          const bCompatible = b.lovableCompatible ?? false;
          comparison = Number(aCompatible) - Number(bCompatible);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [improvements, sortField, sortOrder]);

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

  const renderLovableCompatibility = (item: ImprovementItem) => {
    // Fixed line with proper parentheses
    const isCompatible = item.lovableCompatible ?? (
      !item.technicalRequirements.toLowerCase().includes('expertise') && 
      !item.technicalRequirements.toLowerCase().includes('ar ')
    );
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              {isCompatible ? (
                <Badge className="bg-green-500 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Lovable Compatible</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Requires External</span>
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isCompatible 
              ? "Can be implemented entirely with Lovable platform capabilities" 
              : "Requires external resources or expertise beyond Lovable's capabilities"
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 px-2 flex items-center"
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  );

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
              <TableHead className="w-1/5">
                <SortButton field="name" label="Improvement" />
              </TableHead>
              <TableHead className="w-1/3">Description</TableHead>
              <TableHead>
                <SortButton field="priority" label="Priority" />
              </TableHead>
              <TableHead>
                <SortButton field="type" label="Type" />
              </TableHead>
              <TableHead>Affects</TableHead>
              <TableHead>
                <SortButton field="lovableCompatible" label="Compatibility" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedImprovements.map((improvement, index) => (
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
                  <TableCell>{renderLovableCompatibility(improvement)}</TableCell>
                </TableRow>
                {expandedRows[index] && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={1}></TableCell>
                    <TableCell colSpan={6} className="p-4">
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
                        
                        {improvement.currentStatus && (
                          <div>
                            <div className="mb-1 font-medium text-sm">Current Status</div>
                            <div className="text-sm bg-blue-50 p-2 rounded border border-blue-100">
                              {improvement.currentStatus}
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
