import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FeatureItem } from './types';
import { renderAccessIcon, renderStatusBadge, renderDatabaseStatusBadge } from './utils';
import { ChevronDown, ChevronUp, Database, AlertTriangle, List, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface FeaturesTableProps {
  features: FeatureItem[];
  title: string;
}

const FeaturesTable: React.FC<FeaturesTableProps> = ({ features }) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [completedRequirements, setCompletedRequirements] = useState<Record<string, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to parse database analysis text into requirement items
  const parseDbRequirements = (text: string | undefined): string[] => {
    if (!text) return [];
    
    // Split by periods, semicolons, or line breaks that might separate requirements
    const splitText = text.split(/[.;\n]+/).filter(Boolean);
    
    // Clean up each requirement and remove empty ones
    return splitText
      .map(item => {
        // More thorough number removal - matches patterns like "1.", "1)", "[1]", "Step 1:", etc.
        return item.trim().replace(/^(\d+[\.\)\]:]|\[\d+\]|Step \d+:?|\d+\s*[-–—])\s*/i, '');
      })
      .filter(item => item.length > 0);
  };

  // Handle requirement completion toggle
  const toggleRequirementCompletion = (featureId: string, reqIndex: number) => {
    const requirementId = `${featureId}-${reqIndex}`;
    setCompletedRequirements(prev => ({
      ...prev,
      [requirementId]: !prev[requirementId]
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead className="w-1/5">Feature</TableHead>
          <TableHead className="w-1/3">Description</TableHead>
          <TableHead>Implementation Status</TableHead>
          <TableHead>Database Status</TableHead>
          <TableHead>User Access</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature, index) => (
          <React.Fragment key={`feature-${index}`}>
            <TableRow>
              <TableCell>
                {((feature.testSteps && feature.testSteps.length > 0) || feature.databaseAnalysis) && (
                  <button 
                    onClick={() => toggleRow(index)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    {expandedRows[index] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  {feature.name}
                  {feature.statusUpdated && (
                    <span title="Status updated during analysis" className="ml-1">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{feature.description}</TableCell>
              <TableCell>
                {renderStatusBadge(feature.status)}
                {feature.statusUpdated && feature.originalStatus && (
                  <div className="mt-1 text-xs text-gray-500">
                    Previously: {feature.originalStatus}
                  </div>
                )}
              </TableCell>
              <TableCell>{renderDatabaseStatusBadge(feature.databaseStatus)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Admin</span>
                    {renderAccessIcon(feature.adminAccess)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Est.</span>
                    {renderAccessIcon(feature.establishmentAccess)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">User</span>
                    {renderAccessIcon(feature.individualAccess)}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[index] && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={5} className="p-4">
                  {feature.testSteps && feature.testSteps.length > 0 && (
                    <>
                      <div className="mb-2 font-medium">Test Steps:</div>
                      <ol className="list-decimal pl-5 space-y-1 mb-4">
                        {feature.testSteps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  
                  {feature.databaseAnalysis && (
                    <div className="mt-3">
                      <div className="mb-2 font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Database Analysis:
                      </div>
                      
                      <div className="pl-4 border-l-2 border-blue-400 bg-blue-50 p-3 rounded">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-blue-100/60">
                              <TableHead className="font-medium text-blue-800 py-2 w-[50px]">
                                Status
                              </TableHead>
                              <TableHead className="font-medium text-blue-800 py-2">
                                <div className="flex items-center">
                                  <List className="h-4 w-4 mr-1" />
                                  Implementation Requirements
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parseDbRequirements(feature.databaseAnalysis).map((requirement, reqIndex) => {
                              const requirementId = `${feature.id}-${reqIndex}`;
                              const isCompleted = completedRequirements[requirementId] || false;
                              
                              return (
                                <TableRow key={`req-${reqIndex}`} className="border-t border-blue-100">
                                  <TableCell className="w-[70px]">
                                    <div className="flex items-center justify-center">
                                      <Checkbox 
                                        id={requirementId}
                                        checked={isCompleted}
                                        onCheckedChange={() => toggleRequirementCompletion(feature.id, reqIndex)}
                                        className="mx-auto"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className={`py-2 text-sm ${isCompleted ? 'text-blue-800/70 line-through' : 'text-blue-800'}`}>
                                    {requirement}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default FeaturesTable;
